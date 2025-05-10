// Server/index.js
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
// importa más rutas si las necesitas
import db from './db.js';

const initDB = async () => {
  const database = await db;
  await database.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT,
      correo TEXT NOT NULL UNIQUE,
      telefono TEXT,
      contraseña TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'user'
    );
  `);
};

initDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
