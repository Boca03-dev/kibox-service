const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['cpu', 'gpu', 'ram', 'storage', 'psu', 'case', 'motherboard'], required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  performance: { type: Number, required: true },
  tdp: { type: Number },
  specs: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);