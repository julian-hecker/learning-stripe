import express, { Request, Response } from 'express';
export const app = express();

import cors from 'cors';
app.use(cors({ origin: true }));
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('hey welcome')
})
app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 1.075 });
});
