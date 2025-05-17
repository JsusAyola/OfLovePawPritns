const express = require('express');
const { encrypt, compare } = require('../helpers/handleBcrypt');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const fs        = require('fs');
const path      = require('path');
const mjml2html = require('mjml');
// Ruta de registro con validaciones
router.post(
  '/register',
  [
    check('firstName', 'El nombre es obligatorio y solo puede contener letras')
      .notEmpty().matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/),
    check('lastName', 'El apellido es obligatorio y solo puede contener letras')
      .notEmpty().matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/),
    check('email', 'Correo inválido (solo Gmail, Outlook o Hotmail)')
      .isEmail()
      .matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/),
    check('password', 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo')
      .isLength({ min: 6 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/),
    check('birthDate')
      .isISO8601().withMessage('Fecha de nacimiento inválida')
      .custom(value => {
        const birth = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const mDiff = today.getMonth() - birth.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 18) {
          throw new Error('Debes tener al menos 18 años para registrarte');
        }
        return true;
      }),
    check('role', 'El rol debe ser "cuidador" o "adoptador"')
      .isIn(['cuidador', 'adoptador']),
    check('phone', 'El teléfono es obligatorio y debe iniciar en 3 con 10 dígitos')
      .notEmpty()
      .matches(/^3\d{9}$/)
      .withMessage('El teléfono debe iniciar en 3 y tener 10 dígitos'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, birthDate, role, phone } = req.body;

    try {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        return res.status(400).json({ msg: 'El correo ya está registrado' });
      }

      // Verificar duplicado de teléfono
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ msg: 'El teléfono ya está registrado' });
      }

      const hashedPassword = await encrypt(password);

      user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        birthDate,
        role,
        phone
      });

      await user.save();
      res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
      console.error('Error en /register:', err.message);
      res.status(500).send('Error en el servidor');
    }
  }
);

// Ruta de login con validaciones
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                });
            }
        );
    } catch (err) {
        console.error('Error en el servidor:', err.message);
        res.status(500).send('Error en el servidor');
    }
});


// Ruta para obtener la información de un usuario por su ID
router.get('/users/:id', authMiddleware, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select('-password'); // Excluye la contraseña
  
      if (!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
  
      res.json(user); // Devuelve los datos del usuario
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  });
  


// Ruta para solicitar restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'No existe usuario con ese correo.' });

    // 1. Genera el token y guárdalo
    const resetToken = crypto.randomBytes(20).toString('hex');
    await new ResetToken({ userId: user._id, token: resetToken }).save();

    // 2. Lee y compila tu MJML
    const mjmlPath = path.join(__dirname, '../templates/reset-password.mjml');
    const mjmlString = fs.readFileSync(mjmlPath, 'utf8');
    const { html, errors } = mjml2html(mjmlString, { validationLevel: 'strict' });
    if (errors && errors.length) {
      console.warn('Warn MJML:', errors);
    }

    // 3. Configura tu transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 4. Envía el correo con el HTML compilado
    await transporter.sendMail({
      from: process.env.EMAIL,
      to:   user.email,
      subject: 'Restablece tu contraseña',
      html: html.replace(/{{RESET_TOKEN}}/g, resetToken)
                .replace(/{{FRONTEND_URL}}/g, process.env.FRONTEND_URL || 'http://localhost:4200')
    });

    res.json({ msg: 'Correo de restablecimiento enviado.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para restablecer la contraseña usando el token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const resetToken = await ResetToken.findOne({ token: req.params.token });
        if (!resetToken) {
            return res.status(400).json({ msg: 'El token es inválido o ha expirado.' });
        }

        const user = await User.findById(resetToken.userId);
        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado.' });
        }

        // Actualizar la contraseña
        const newPassword = req.body.password;
        user.password = await encrypt(newPassword);
        await user.save();

        // Eliminar el token después de restablecer la contraseña
        await resetToken.deleteOne();

        res.status(200).json({ msg: 'Contraseña restablecida exitosamente.' });
    } catch (err) {
        console.error('Error en el servidor:', err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener los datos del usuario logueado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Obtener el ID del usuario desde el token JWT
        const user = await User.findById(userId).select('-password');  // Excluir la contraseña de los datos devueltos

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Incluir la fecha de creación del usuario en la respuesta
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt // Aquí incluimos la fecha de creación
        };

        res.json(userData);  // Devolver los datos del usuario incluyendo createdAt
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;