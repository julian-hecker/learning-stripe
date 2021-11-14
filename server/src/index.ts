import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Stripe from 'stripe';

config();

const stripe = new Stripe(process.env.STRIPE_API_SK, {
  apiVersion: '2020-08-27',
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// https://stripe.com/docs/payments/save-during-payment?platform=react-native&ui=payment-sheet#react-native-setup
app.post('/checkout', async (req, res) => {
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
    // setup_future_usage: true,
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_API_PK,
  });
});

app.listen(4242, () => console.log('http://localhost:4242'));

// https://www.freecodecamp.org/news/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c/
