const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for faster queries
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
