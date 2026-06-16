const mongoose = require('mongoose');

const agentApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  reraNumber: { type: String, required: true, trim: true },
  agencyName: { type: String, required: true, trim: true },
  experience: { type: String, required: true },
  localities: [{ type: String }],
  about: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('AgentApplication', agentApplicationSchema);