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

// Ruta de registro con validaciones
router.post(
    '/register',
    [
        check('firstName', 'El nombre es obligatorio y solo puede contener letras')
            .not().isEmpty().matches(/^[A-Za-z]+$/),
        check('lastName', 'El apellido es obligatorio y solo puede contener letras')
            .not().isEmpty().matches(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/),
        check('email', 'Correo inválido (solo Gmail, Outlook o Hotmail)')
            .isEmail().matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/),
        check('password', 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo')
            .isLength({ min: 6 })
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/),
        check('birthDate', 'Fecha de nacimiento inválida').isISO8601(),
        check('role', 'El rol es obligatorio y debe ser "cuidador" o "adoptador"')
            .isIn(['cuidador', 'adoptador']),
        check('phone', 'El teléfono es obligatorio para cuidadores')
            .if((value, { req }) => req.body.role === 'cuidador').not().isEmpty()
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

            if (role === 'cuidador') {
                let phoneExists = await User.findOne({ phone });
                if (phoneExists) {
                    return res.status(400).json({ msg: 'El teléfono ya está registrado' });
                }
            }

            const birthDateObj = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }

            if (age < 18) {
                return res.status(400).json({ msg: 'Debes tener al menos 18 años para registrarte' });
            }

            const hashedPassword = await encrypt(password);

            user = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
                birthDate,
                role,
                phone: role === 'cuidador' ? phone : undefined
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
                    userId: user.id,
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
        if (!user) {
            return res.status(400).json({ msg: 'No se encontró ningún usuario con ese correo electrónico.' });
        }

        // Generar un token de restablecimiento
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Crear un nuevo documento ResetToken para el usuario
        const newToken = new ResetToken({
            userId: user._id,
            token: resetToken,
        });

        await newToken.save();

        // Configurar el correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Tu correo
                pass: process.env.EMAIL_PASSWORD, // Tu contraseña de correo
            },
        });

        // Plantilla HTML para el correo
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f8ff;
                    color: #333;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    margin: 0 auto;
                    max-width: 600px;
                    border-radius: 15px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #ffd700;
                    padding: 15px;
                    border-radius: 15px 15px 0 0;
                    text-align: center;
                    color: #000;
                    position: relative;
                }
                .header img {
                    max-width: 60px;
                    position: absolute;
                    top: 10px;
                    left: 20px;
                }
                .title {
                    font-size: 28px;
                    font-weight: bold;
                    margin: 0;
                }
                .content {
                    margin: 20px 0;
                    padding: 20px;
                }
                .content img {
                    max-width: 100px;
                    display: block;
                    margin: 10px auto;
                }
                .button {
                    background-color: #e74c3c;
                    color: #fff;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 18px;
                    display: inline-block;
                    margin-top: 15px;
                }
                .button:hover {
                    background-color: #c0392b;
                }
                .footer {
                    background-color: #dcdcdc;
                    padding: 10px;
                    border-radius: 0 0 15px 15px;
                    font-size: 14px;
                    color: #555;
                }
                .footer-icons {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 10px;
                }
                .footer-icons img {
                    max-width: 30px;
                    margin: 0 10px;
                }
                .contact {
                    font-size: 16px;
                    color: #00509d;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://cdn-icons-png.flaticon.com/512/616/616430.png" alt="Pata de Perro">
                    <h1 class="title">¡Hola Humano!</h1>
                </div>
                <div class="content">
                    <p>¿Olvidaste tu contraseña?</p>
                    <p>¡Es muy fácil!</p>
                    <img src="https://cdn-icons-png.flaticon.com/512/194/194279.png" alt="Icono de Gato">
                    <p>Te damos una patita, solo debes hacer clic acá:</p>
                    <a href="http://localhost:4200/auth/change-password/${resetToken}" class="button">Restablecer Contraseña</a>
                </div>
                <div class="footer">
                    <p>¡Gracias por usar nuestra plataforma!</p>
                    <div class="footer-icons">
                        <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="Teléfono">
                        <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Correo">
                    </div>
                    <p class="contact">0810-220-2345 | +54-911-6702-6320</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Configurar opciones del correo para enviar la plantilla HTML
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Solicitud de restablecimiento de contraseña',
            html: htmlTemplate,
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error al enviar el correo:', err);
                return res.status(500).json({ msg: 'Error al enviar el correo.' });
            }
            res.status(200).json({ msg: 'Correo de restablecimiento de contraseña enviado.' });
        });
    } catch (err) {
        console.error('Error en el servidor:', err.message);
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


// Ruta para actualizar los datos del usuario logueado
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Obtener el ID del usuario desde el token JWT
        const { firstName, lastName, birthDate, phone } = req.body;

        // Obtener el usuario actual para verificar su rol
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Actualizar los datos básicos del usuario
        user.firstName = firstName;
        user.lastName = lastName;
        user.birthDate = birthDate;

        // Si el rol es 'cuidador', actualizar el teléfono
        if (user.role === 'cuidador') {
            user.phone = phone;
        }

        // Guardar los cambios en la base de datos
        await user.save();

        // Devolver la respuesta con los datos actualizados
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
