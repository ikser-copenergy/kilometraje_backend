import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import kilometrajeRoutes from './routes/kilometraje.routes';
import cors from 'cors';

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: isProduction ? process.env.CLIENT_ORIGIN : '*',
  //credentials: isProduction, // Solo se usa si usa cookies o autenticación
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/kilometraje', kilometrajeRoutes);

const PORT = process.env.PORT || 3000;

console.log('DB CONFIG:', {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  });
  

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
