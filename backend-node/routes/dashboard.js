const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación
const router = express.Router();

// Ruta protegida - dashboard, solo usuarios autenticados pueden acceder
router.get('/dashboard', authMiddleware, (req, res) => {
  // Aquí podrías devolver información personalizada del usuario en el dashboard
  res.json({
    msg: 'Bienvenido al dashboard',
    user: req.user // Información del usuario obtenida del token
  });
});

module.exports = router;