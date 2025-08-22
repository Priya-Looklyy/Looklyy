const express = require('express');
const cors = require('cors');

// Re-enable basic routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
// const brandRoutes = require('./routes/brands.routes');
// const lookboardRoutes = require('./routes/lookboards.routes');
// const productRoutes = require('./routes/products.routes');

const app = express();

app.use(cors({ 
  origin: [
    'https://looklyy.com',
    'https://www.looklyy.com',
    'http://localhost:3000' // for local development
  ], 
  credentials: true 
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

// Re-enable basic routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/brands', brandRoutes);
// app.use('/api/lookboards', lookboardRoutes);
// app.use('/api/products', productRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

module.exports = app;


