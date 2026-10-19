const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const orderRoutes = require('./routes/orders');
const connectDB = require('./db');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }

  console.error('Unhandled request error:', err);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Unable to start the API:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
