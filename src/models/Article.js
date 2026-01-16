const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  content: {
    type: String,
    required: [true, 'Article content is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Article category is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  featuredImage: {
    type: String,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  source: {
    type: {
      type: String,
      enum: ['original', 'sourced', 'aggregated', 'translated'],
      default: 'original',
    },
    name: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    originalPublishDate: {
      type: Date,
    },
  },
}, {
  timestamps: true,
});

articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Article', articleSchema);

