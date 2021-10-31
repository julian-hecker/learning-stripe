import Stripe from 'stripe';

export const stripe = new Stripe(
  'sk_test_51JJ4mVLXJPxkoziMXAJ8o5GDqiuNNOWIYHsZv8MeUW0DIDTRmg40RlFfHbVlx4siFx7qO07SeCkRr0HV3vc8FOcg002Lz2AMp1',
  {
    apiVersion: '2020-08-27',
  },
);
