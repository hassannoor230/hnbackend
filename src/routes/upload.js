import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'
import { upload, handleUpload } from '../middleware/upload.js'
import { uploadImage as projectUpload } from '../controllers/projectController.js'
import { uploadImage as settingsUpload } from '../controllers/settingsController.js'

const router = Router()

// Legacy upload endpoints (kept for compatibility)
router.post('/upload', authenticate, upload, handleUpload, projectUpload)
router.post('/upload/settings', authenticate, upload, handleUpload, settingsUpload)

export default router