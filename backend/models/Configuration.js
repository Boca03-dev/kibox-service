const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  components: {
    cpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    ram: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    storage: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    psu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    motherboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' }
  },
  totalPrice: { type: Number },
  purpose: { type: String },
  budget: { type: Number },
  games: [{ type: String }],
  sentToAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Configuration', configurationSchema);