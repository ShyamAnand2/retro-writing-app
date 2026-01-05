// DOCUMENT ROUTES: Define endpoints for document operations

import express from 'express';
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  searchDocuments
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// VALIDATION RULES
const documentValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status value'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// ROUTES
// GET /api/documents - Get all user's documents
router.get('/', getDocuments);

// GET /api/documents/search?q=keyword - Search documents
router.get('/search', searchDocuments);

// POST /api/documents - Create new document
router.post('/', documentValidation, validate, createDocument);

// GET /api/documents/:id - Get single document
router.get('/:id', getDocument);

// PUT /api/documents/:id - Update document
router.put('/:id', documentValidation, validate, updateDocument);

// DELETE /api/documents/:id - Delete document
router.delete('/:id', deleteDocument);

export default router;
