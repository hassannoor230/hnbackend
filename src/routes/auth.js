import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { loginLimiter } from '../middleware/rateLimit.js'
import {
  login as loginCtrl,
  logout as logoutCtrl,
  me as meCtrl,
  changePassword as changePasswordCtrl,
  updateProfile as updateProfileCtrl,
} from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/login', loginLimiter, body('email').isEmail(), body('password').isLength({ min: 1 }), (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() })
  }
  next()
}, loginCtrl)

router.post('/logout', logoutCtrl)
router.get('/me', authenticate, meCtrl)
router.put('/change-password', authenticate, body('currentPassword').isLength({ min: 1 }), body('newPassword').isLength({ min: 6 }), (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() })
  next()
}, changePasswordCtrl)
router.put('/profile', authenticate, updateProfileCtrl)

export default router