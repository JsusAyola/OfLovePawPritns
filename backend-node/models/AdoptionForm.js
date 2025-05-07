const mongoose = require('mongoose');

const adoptionFormSchema = new mongoose.Schema({
    adoptador_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // ✅ Solo un formulario base por usuario
    },
    // Datos personales (reutilizables)
    edad: { type: String, required: true },
    ocupacion: { type: String, required: true },
    experiencia: { type: String, required: true },
    otraMascota: { type: String, required: true },
    cantidadMascotas: { type: Number, default: 0 },
    tipoMascota: { type: String, default: 'No especificado' },
    ninosEnCasa: { type: String, required: true },
    tiempoSola: { type: String, required: true },
    veterinario: { type: String, required: true },
    visitasSeguimiento: { type: String, required: true },
    motivo: { type: String, required: true },
    tiempoDisponible: { type: String, required: true },
    presupuesto: { type: String, required: true },

    // Campos específicos de cada adopción (NO reutilizables)
    mascotas_adoptadas: [ // ✅ Array para historial de mascotas
        {
            mascota_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
            cuidador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            fecha_adopcion: { type: Date, default: Date.now }
        }
    ],

    reuseForm: { 
        type: Boolean, 
        default: false // ✅ Preferencia del usuario
    }
}, { timestamps: true });

module.exports = mongoose.model('AdoptionForm', adoptionFormSchema);