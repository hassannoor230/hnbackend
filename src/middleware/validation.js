import { body, validationResult } from 'express-validator'

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
    })
  }
  next()
}

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 1 }).withMessage('Password is required.'),
  handleValidation,
]

export const inquiryValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required (max 100 chars).'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message is required (max 5000 chars).'),
  body('subject').optional().trim().isLength({ max: 200 }),
  body('projectType').optional().trim().isLength({ max: 100 }),
  body('budget').optional().trim().isLength({ max: 100 }),
  body('timeline').optional().trim().isLength({ max: 100 }),
  handleValidation,
]

export const projectValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars).'),
  body('slug').trim().isLength({ min: 1 }).withMessage('Slug is required.').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be lowercase with hyphens only.'),
  body('description').trim().isLength({ min: 1, max: 5000 }).withMessage('Description is required (max 5000 chars).'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category is required.'),
  body('year').optional().trim().isLength({ max: 20 }),
  body('technologies').optional().isArray().withMessage('Technologies must be an array.'),
  body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid.'),
  body('liveUrl').optional().isURL().withMessage('Live URL must be valid.'),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
  handleValidation,
]

export const skillValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required (max 100 chars).'),
  body('category').optional().isIn(['Frontend', 'Backend', 'Database', 'Tools', 'Design', 'Mobile', 'Other']),
  body('level').optional().isInt({ min: 0, max: 100 }),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('visible').optional().isBoolean(),
  handleValidation,
]

export const experienceValidation = [
  body('company').trim().isLength({ min: 1, max: 200 }).withMessage('Company is required (max 200 chars).'),
  body('position').trim().isLength({ min: 1, max: 200 }).withMessage('Position is required (max 200 chars).'),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('startDate').optional().trim().isLength({ max: 20 }),
  body('endDate').optional().trim().isLength({ max: 20 }),
  body('current').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('visible').optional().isBoolean(),
  handleValidation,
]

export const testimonialValidation = [
  body('clientName').trim().isLength({ min: 1, max: 150 }).withMessage('Client name is required (max 150 chars).'),
  body('review').trim().isLength({ min: 1, max: 2000 }).withMessage('Review is required (max 2000 chars).'),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('position').optional().trim().isLength({ max: 150 }),
  body('company').optional().trim().isLength({ max: 150 }),
  body('visible').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
  handleValidation,
]

export const educationValidation = [
  body('degree').trim().isLength({ min: 1, max: 200 }).withMessage('Degree is required (max 200 chars).'),
  body('institute').trim().isLength({ min: 1, max: 200 }).withMessage('Institute is required (max 200 chars).'),
  body('year').optional().trim().isLength({ max: 20 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('certificateUrl').optional().isURL().withMessage('Certificate URL must be valid.'),
  body('visible').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
  handleValidation,
]

export const blogValidation = [
  body('title').trim().isLength({ min: 1, max: 300 }).withMessage('Title is required (max 300 chars).'),
  body('slug').trim().isLength({ min: 1 }).withMessage('Slug is required.').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be lowercase with hyphens only.'),
  body('content').trim().isLength({ min: 1, max: 100000 }).withMessage('Content is required (max 100000 chars).'),
  body('excerpt').optional().trim().isLength({ max: 500 }),
  body('category').optional().trim().isLength({ max: 100 }),
  body('tags').optional().isArray(),
  body('published').optional().isBoolean(),
  body('coverImage').optional().isURL(),
  body('metaTitle').optional().trim().isLength({ max: 200 }),
  body('metaDescription').optional().trim().isLength({ max: 300 }),
  handleValidation,
]