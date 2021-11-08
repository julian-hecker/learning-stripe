import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FirebaseAppProvider } from 'reactfire';
import { App } from './App';
import './index.css';

export const firebaseConfig = {
  apiKey: 'AIzaSyAgywKWJLKl3ohclOD1nk0JUqAUJBL61y4',
  authDomain: 'barbago-859cf.firebaseapp.com',
  projectId: 'barbago-859cf',
  storageBucket: 'barbago-859cf.appspot.com',
  messagingSenderId: '826208380986',
  appId: '1:826208380986:web:8e9c0021ab5e4b4f1d2d03',
  measurementId: 'G-D2FNWDVLC6',
};

export const stripePromise = loadStripe(
  'pk_test_51JJ4mVLXJPxkoziMaKqB1C8o88yhZWmwnDAotNr3CCMLX7bQm3hPiF3xQwLxFRcyXcqPPk1UNSdGbLL85zxzJeF300OCOjvtiE',
);

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
