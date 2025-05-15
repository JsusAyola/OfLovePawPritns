const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Asegúrate de que tienes el modelo User
const { encrypt, compare } = require('../helpers/handleBcrypt');


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

// **Agrega esta ruta para actualizar usuario**
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, birthDate, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;

    if (user.role === 'cuidador') {
      user.phone = phone;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para cambiar la contraseña del usuario logueado
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Obtener el ID del usuario desde el token JWT
        const { currentPassword, newPassword } = req.body;

        // Buscar al usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Comparar la contraseña actual con la almacenada
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await encrypt(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.json({ msg: 'Contraseña cambiada con éxito' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
