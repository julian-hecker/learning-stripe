import { app } from './api';
const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`API started on http://localhost:${port}`),
);
