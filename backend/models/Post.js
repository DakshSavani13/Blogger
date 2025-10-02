const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  featuredImage: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from title before saving
postSchema.pre('save', async function(next) {
  try {
    if (this.isModified('title') || this.isNew || !this.slug) {
      let baseSlug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let slug = baseSlug;
      let counter = 1;
      
      // Check for existing slugs and make unique if necessary
      while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.slug = slug;
      console.log('Generated slug:', this.slug);
    }
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

// Generate excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
