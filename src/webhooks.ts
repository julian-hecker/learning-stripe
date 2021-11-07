import Stripe from 'stripe';
import { Request, Response } from 'express';

import { stripe } from './';

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
) => {
  const signature = req.headers['stripe-signature'] as string;
  const event = stripe.webhooks.constructEvent(
    req['rawBody'],
    signature,
    process.env.STRIPE_WEBHOOK_SECRET ?? '',
  );

  try {
    await webhookHandlers[event.type](event.data.object);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

const webhookHandlers = {
  // List of all event types
  // https://stripe.com/docs/api/events/types
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    console.log(data);
  },
  'payment_intent.payment_failed': async (
    data: Stripe.PaymentIntent,
  ) => {
    console.log(data);
  },
};
