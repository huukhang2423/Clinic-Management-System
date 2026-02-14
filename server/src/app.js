import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import medicationRoutes from './routes/medicationRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/medications', medicationRoutes);
app.use('/api/patients', patientRoutes);

// Serve frontend in production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Error handler
app.use(errorHandler);

export default app;
