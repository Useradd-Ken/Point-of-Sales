import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRoutes from './routes/products.js';
import salesRoutes from './routes/sales.js';
import salesDetailsRoutes from './routes/salesDetails.js';
import userRoutes from './routes/users.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users',userRoutes);
app.use('/api/salesDetails',salesDetailsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`POS backend listening on http://localhost:${port}`);
});
