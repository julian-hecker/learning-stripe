import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { App } from './App';
import './index.css';

export const stripePromise = loadStripe(
  'pk_test_51JJ4mVLXJPxkoziMaKqB1C8o88yhZWmwnDAotNr3CCMLX7bQm3hPiF3xQwLxFRcyXcqPPk1UNSdGbLL85zxzJeF300OCOjvtiE',
);

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root'),
);
