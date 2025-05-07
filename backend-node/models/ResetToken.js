const mongoose = require('mongoose');

// Definir el esquema para almacenar tokens de restablecimiento
const ResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Referencia al modelo de usuario
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // El token caduca en 1 hora (3600 segundos)
  },
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);
