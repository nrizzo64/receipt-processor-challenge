import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import receiptRouter from './routes/receipts.router.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.use('/receipts', receiptRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});