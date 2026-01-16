const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 5000,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

messageSchema.index({ isRead: 1, createdAt: -1 });
messageSchema.index({ isArchived: 1 });

module.exports = mongoose.model('Message', messageSchema);
