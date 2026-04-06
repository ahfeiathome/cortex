import express from 'express';
import { capturesRouter } from './routes/captures';

const app = express();
const PORT = process.env.CORTEX_API_PORT ?? 3141;

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cortex-api', timestamp: new Date().toISOString() });
});

// Captures endpoint — agent-facing Knowledge Hub writes
app.use('/api/captures', capturesRouter);

app.listen(PORT, () => {
  console.log(`CORTEX API listening on http://localhost:${PORT}`);
});
