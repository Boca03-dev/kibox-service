const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minRequirements: {
    ramGB: { type: Number, required: true },
    gpuPerformance: { type: Number, required: true },
    cpuPerformance: { type: Number, required: true }
  },
  recommendedRequirements: {
    ramGB: { type: Number, required: true },
    gpuPerformance: { type: Number, required: true },
    cpuPerformance: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);