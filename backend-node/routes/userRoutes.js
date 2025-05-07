const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Asegúrate de que tienes el modelo User

// Ruta para obtener un usuario por su ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
