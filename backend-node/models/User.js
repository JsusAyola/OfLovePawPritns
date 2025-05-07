const mongoose = require('mongoose');

// Definir el esquema del usuario
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Asegura que no se repitan emails
  },
  password: {
    type: String,
    required: true, // Contraseña siempre requerida
  },
  birthDate: {
    type: Date,
    required: function () {
      return this.role !== 'administrador'; // Fecha de nacimiento requerida solo para cuidadores y adoptadores
    },
  },
  role: {
    type: String,
    enum: ['cuidador', 'adoptador', 'administrador'], // Incluye el rol de administrador
    required: true,
  },
  phone: {
    type: String,
    required: function () {
      return this.role === 'cuidador'; // Teléfono requerido solo si es cuidador
    },
  },
  mascotas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: function () {
        return this.role === 'cuidador';
      },
    },
  ],
}, { timestamps: true });

// Asegurarnos de que solo haya un administrador
UserSchema.pre('save', async function (next) {
  if (this.role === 'administrador') {
    const existingAdmin = await mongoose.model('User').findOne({ role: 'administrador' });
    if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
      throw new Error('Solo puede existir un administrador en el sistema.');
    }
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
