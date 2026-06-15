const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'site_visit', 'negotiation', 'closed', 'lost'],
    default: 'new'
  },
  notes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  source: {
    type: String,
    enum: ['website', 'phone', 'whatsapp', 'referral', 'other'],
    default: 'website'
  },
  followUpDate: Date,
  budget: String,
  requirements: String
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
