// VALIDATION MIDDLEWARE: Checks validation results from express-validator

import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  // Get validation errors from request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors into readable array
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  // No errors, continue to controller
  next();
};
