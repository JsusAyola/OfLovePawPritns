const express = require('express');
const User = require('../models/User');
const Pet = require('../models/Pet');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Ruta para obtener todos los usuarios (sin incluir al administrador logueado)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Excluimos al administrador logueado de la lista de usuarios
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password'); // Excluye el campo de la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
});

// Ruta para eliminar un usuario
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Verificar si el usuario que hace la solicitud es el mismo que el que se quiere eliminar
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

// Ruta para obtener todas las mascotas
router.get('/pets', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascotas.' });
  }
});

// Ruta para eliminar una mascota
router.delete('/pets/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ msg: 'Mascota no encontrada.' });
    }
    res.json({ msg: 'Mascota eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mascota.' });
  }
});

module.exports = router;
