const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { execSync } = require('child_process');
const connectDB = require('./config/db'); // 👈 conexión a MongoDB modular

dotenv.config();

// Crear app y puerto
const app = express();
const PORT = process.env.PORT || 5000;

// Liberar puerto si está en uso
try {
  console.log(`🔄 Verificando si el puerto ${PORT} está en uso...`);
  execSync(`npx kill-port ${PORT}`);
  console.log(`✅ Puerto ${PORT} liberado.`);
} catch (err) {
  console.log(`⚠️ No se pudo liberar el puerto ${PORT}, puede que no estuviera en uso.`);
}

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors({
  origin: ['https://pett-a1d97.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const petRoutes = require('./routes/pett');
const solicitudesRoutes = require('./routes/solicitudes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', dashboardRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pett', petRoutes);  // ⚠️ Podés revisar si esto es duplicado/conflictivo

// Ruta 404
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
