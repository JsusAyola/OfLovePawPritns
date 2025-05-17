const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
    mascota_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    adoptador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cuidador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdoptionForm', required: true },
    estado: { type: String, enum: ['pendiente', 'aprobada', 'rechazada'], default: 'pendiente' },
     fecha_solicitud: { type: Date, default: Date.now },
     motivoRechazo: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
