import express, { NextFunction, Request, Response } from 'express';
export const app = express();

import cors from 'cors';
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { auth } from './firebase';
import { createSetupIntent, listPaymentMethods } from './customers';

app.use(cors({ origin: true }));
app.use(
  express.json({
    verify: (req, _res, buffer) => (req['rawBody'] = buffer),
  }),
);
app.use(decodeJWT);

app.get('/', (req: Request, res: Response) => {
  res.send('hey welcome');
});
app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 1.075 });
});
app.post(
  '/checkouts',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  }),
);

app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  }),
);

app.post('/hook', (req: Request, res: Response) => {
  console.dir(req);
  res.sendStatus(200);
});

app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  }),
);

app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet.data);
  }),
);

function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

async function decodeJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.error(err);
    }
  }
  next();
}

export function validateUser(req: Request) {
  const user = req['currentUser'];
  if (!user) {
    throw new Error('Must be logged in!');
  }
  return user;
}
