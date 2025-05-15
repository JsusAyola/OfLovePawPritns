const mongoose = require('mongoose');
const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    validate: {
      validator: function (value) {
        return /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(value); // Valida letras y tildes
      },
      message: 'El nombre solo puede contener letras y tildes.'
    }
  },
  birthDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date(); // No permite fechas futuras
      },
      message: 'La fecha de nacimiento no puede ser en el futuro.'
    }
  },
  type: {
    type: String,
    enum: ['Perro', 'Gato'],
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    enum: ['Macho', 'Hembra'],
    required: true
  },
  size: {
    type: String,
    enum: ['Pequeño', 'Mediano', 'Grande'],
    required: true
  },
  weight: {
    type: String,
    enum: ['Menos de 5kg', '5-15kg', '15-30kg', 'Más de 30kg'],
    required: true
  },  
  vaccines: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        const allowedVaccines = [
          // Vacunas para perros
          'Rabia',
          'Moquillo',
          'Parvovirus',
          'Hepatitis Infecciosa Canina',
          'Leptospirosis',
          'Parainfluenza',
          'Bordetella',
          'Coronavirus Canino',
  
          // Vacunas para gatos
          'Rabia',
          'Panleucopenia',
          'Rinotraqueítis Viral Felina',
          'Calicivirus Felino',
          'Leucemia Felina',
          'Clamidiosis Felina',
          'Peritonitis Infecciosa Felina',
          'Bordetella Felina'
        ];
        return value.every(vaccine => allowedVaccines.includes(vaccine));
      },
      message: 'Una o más vacunas no son válidas.'
    }
  },
  isVaccinated: {
    type: Boolean,
    required: true
  },
  sterilized: {
    type: Boolean,
    required: true
  },
  activityLevel: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto'],
    required: true
  },
  behaviorPeople: {
    type: String,
    enum: ['Amigable', 'Tímido', 'Agresivo', 'Territorial'],
    required: true
  },
  behaviorAnimals: {
    type: String,
    enum: ['Sociable', 'Tímido', 'Agresivo', 'Territorial'],
    required: true
  },
  image: {
    type: String, // URL o base64
    default: ''
  },
  approvalStatus: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },

  status: {
    type: String,
    enum: ['disponible', 'adoptado', 'fallecido'],
    default: 'disponible'
  },
  
  cuidador_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalConditions: {
    type: String,
    enum: ['Ninguna', 'Enfermedades crónicas', 'Lesiones previas', 'Afecciones respiratorias', 'Otro'],
    required: true
  },
  allergies: {
    type: String,
    enum: ['Ninguna', 'Alimentos', 'Polvo/Ácaros', 'Polen', 'Medicamentos', 'Otro'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  verificationImage: {
    type: String,
    required: true
  },
  ownershipConfirmation: {
    type: Boolean,
    required: true
  },
    ownershipConfirmation: {
    type: Boolean,
    required: true
  },

  interestedCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);