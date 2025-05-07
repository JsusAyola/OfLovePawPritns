const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  inputData: { type: Object, required: true },
  result: {
    willBeAdopted: Boolean,
    confidence: Number,
    probability: Number
  },
  message: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Prediction', predictionSchema);