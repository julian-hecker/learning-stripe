// https://stripe.com/docs/payments/save-and-reuse

import { stripe } from './config';

export async function main() {
  try {
    const customer = await stripe.customers.create({
      name: 'Julian',
    });
    console.log(customer);
  } catch (err) {
    console.error(err);
  }
}
