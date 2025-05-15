const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { execSync } = require('child_process');

dotenv.config();

// Importación de rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const petRoutes = require('./routes/pett');
const solicitudesRoutes = require('./routes/solicitudes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const errorHandler = require('./middleware/errorHandler');

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

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definición de rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', dashboardRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pett', petRoutes);  // ¡revisar que esta ruta sea correcta y no cause conflicto!

// Manejo de rutas inexistentes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global para manejo de errores (debe ir después de todas las rutas)
app.use(errorHandler);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
