// DOCUMENT CONTROLLER: Handles all document operations (Create, Read, Update, Delete)

import Document from '../models/Document.js';

// CREATE: Save new document (POST /api/documents)
export const createDocument = async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    // Create document with logged-in user as author
    const document = await Document.create({
      title,
      content,
      tags,
      status,
      author: req.user._id // req.user set by protect middleware
    });

    // Populate author details in response
    await document.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: document
    });

  } catch (error) {
    console.error('Create document error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating document'
    });
  }
};

// READ ALL: Get all documents for logged-in user (GET /api/documents)
export const getDocuments = async (req, res) => {
  try {
    // Use our custom static method to get non-deleted documents
    const documents = await Document.findByAuthor(req.user._id)
      .populate('author', 'username email') // Include author info
      .select('-__v'); // Exclude version key from response

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

// READ ONE: Get single document by ID (GET /api/documents/:id)
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      author: req.user._id, // Ensure user owns this document
      isDeleted: false
    }).populate('author', 'username email');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Get document error:', error);
    
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching document'
    });
  }
};

// UPDATE: Modify existing document (PUT /api/documents/:id)
export const updateDocument = async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    // Find document and verify ownership
    const document = await Document.findOne({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: false
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update fields if provided
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    if (tags !== undefined) document.tags = tags;
    if (status !== undefined) document.status = status;

    // Save changes (will trigger pre-save hook to recalculate word count)
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });

  } catch (error) {
    console.error('Update document error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating document'
    });
  }
};

// DELETE: Remove document (DELETE /api/documents/:id)
export const deleteDocument = async (req, res) => {
  try {
    // Option 1: Soft delete (recommended - keeps data for recovery)
    const document = await Document.findOne({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: false
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.softDelete(); // Use our custom method

    // Option 2: Hard delete (permanently removes from database)
    // await Document.findOneAndDelete({
    //   _id: req.params.id,
    //   author: req.user._id
    // });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};

// BONUS: Search documents by title or content (GET /api/documents/search?q=keyword)
export const searchDocuments = async (req, res) => {
  try {
    const { q } = req.query; // Get search query from URL parameter

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    // MongoDB text search or regex search
    const documents = await Document.find({
      author: req.user._id,
      isDeleted: false,
      $or: [
        { title: { $regex: q, $options: 'i' } }, // Case-insensitive search in title
        { content: { $regex: q, $options: 'i' } } // Case-insensitive search in content
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching documents'
    });
  }
};
