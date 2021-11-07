import express, { NextFunction, Request, Response } from 'express';
export const app = express();

import cors from 'cors';
import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
app.use(cors({ origin: true }));
app.use(
  express.json({
    verify: (req, _res, buffer) => (req['rawBody'] = buffer),
  }),
);
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

function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
