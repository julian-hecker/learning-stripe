import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyAgywKWJLKl3ohclOD1nk0JUqAUJBL61y4',
  authDomain: 'barbago-859cf.firebaseapp.com',
  projectId: 'barbago-859cf',
  storageBucket: 'barbago-859cf.appspot.com',
  messagingSenderId: '826208380986',
  appId: '1:826208380986:web:8e9c0021ab5e4b4f1d2d03',
  measurementId: 'G-D2FNWDVLC6',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
