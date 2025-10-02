const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    if (this.name) {
      this.slug = this.name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
