import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Stripe from 'stripe';

config();

const STRIPE_API_PK = process.env.STRIPE_API_PK;
const STRIPE_API_SK = process.env.STRIPE_API_SK;
const STRIPE_WHSEC = process.env.STRIPE_WHSEC;
const stripe = new Stripe(STRIPE_API_SK, {
  apiVersion: '2020-08-27',
});

const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(cors());

// https://stripe.com/docs/payments/save-during-payment?platform=react-native&ui=payment-sheet#react-native-setup
app.post('/checkout', async (req, res) => {
  console.log('checking out');
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' },
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['card'],
    setup_future_usage: 'on_session',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: STRIPE_API_PK,
  });
});

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    if (!STRIPE_WHSEC) return res.sendStatus(500);

    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WHSEC,
      );
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }

    switch (event.type) {
      case 'customer.created':
        console.log(event);
        break;
      case 'payment_intent.created':
        console.log(event);
        break;
      case 'charge.succeeded':
        console.log(event);
        break;
      case 'payment_method.attached':
        console.log(event);
        break;
      case 'payment_intent.succeeded':
        console.log(event);
        break;
      case 'capability.updated':
        console.log(event);
        break;
      case 'person.created':
        console.log(event);
        break;
      default:
        console.error(`Unexpected webhook type ${event.type}`);
    }
    res.sendStatus(200);
  },
);

app.get('/create-account', async (req, res) => {
  let account: Stripe.Account;
  try {
    account = await stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      company: {
        name: 'aaaAAAaaaAAAaaaAAAaaaAAAaaa',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }

  let accountLink: Stripe.AccountLink;
  try {
    accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: 'account_onboarding',
      return_url: 'http://localhost:4242/return',
      refresh_url: 'http://localhost:4242/refresh',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }

  res.json(accountLink);
});

app.get('/return', (req, res) => {
  res.send('success!');
});
app.get('/refresh', (req, res) => {
  res.send('failed, try again!');
});
app.get('/earn', async (req, res) => {
  try {
    const payout = await stripe.payouts.create({
      amount: 1099,
      currency: 'usd',
      description: 'barbago payout',
      // destination: 'ba_1JvozKQ0rtbx1tUpGXseIpNH',
      // source_type: 'bank_account',
      destination: 'card_1JvryKPrZYFBUwkenzS3cNIt',
      source_type: 'card',
    });
    res.json(payout);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.listen(4242, () => console.log('http://localhost:4242'));

// https://www.freecodecamp.org/news/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c/
