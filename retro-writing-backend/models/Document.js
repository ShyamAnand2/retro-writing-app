// DOCUMENT MODEL: Defines structure of writing documents in MongoDB

import mongoose from 'mongoose';

// SCHEMA: Blueprint for document storage
const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Untitled Document' // Default if no title provided
    },
    content: {
      type: String, // Stores HTML content from Quill editor
      default: '' // Empty string for new documents
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User', // Model name to populate from
      required: true,
      index: true // Create index for faster queries by author
    },
    // Optional: Track document status
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'], // Only these values allowed
      default: 'draft'
    },
    // Optional: Word count for statistics
    wordCount: {
      type: Number,
      default: 0
    },
    // Optional: Tags for categorization
    tags: [{
      type: String,
      trim: true
    }],
    // Soft delete flag (keeps document in DB but marks as deleted)
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// INDEXES: Speed up queries (MongoDB feature for performance)
// Compound index for finding user's documents sorted by update time
documentSchema.index({ author: 1, updatedAt: -1 }); // 1 = ascending, -1 = descending

// PRE-SAVE HOOK: Calculate word count before saving
documentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Strip HTML tags and count words
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  next();
});

// INSTANCE METHOD: Soft delete document (mark as deleted without removing from DB)
documentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// STATIC METHOD: Get all non-deleted documents for a user
documentSchema.statics.findByAuthor = function(authorId) {
  return this.find({ 
    author: authorId, 
    isDeleted: false 
  }).sort({ updatedAt: -1 }); // Sort by most recently updated first
};

// QUERY HELPER: Exclude deleted documents from queries
documentSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Create and export model
const Document = mongoose.model('Document', documentSchema);

export default Document;
