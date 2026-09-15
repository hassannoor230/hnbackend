import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'
import { apiLimiter, inquiryLimiter, uploadLimiter } from '../middleware/rateLimit.js'
import {
  inquiryValidation, projectValidation, skillValidation, experienceValidation,
  testimonialValidation, educationValidation, blogValidation,
} from '../middleware/validation.js'
import {
  listPublic, getBySlug, incrementViews, uploadImage, deleteImage,
} from '../controllers/projectController.js'
import { crud as skillCrud, listPublic as skillList, reorder as skillReorder } from '../controllers/skillController.js'
import { crud as expCrud, listPublic as expList, reorder as expReorder } from '../controllers/experienceController.js'
import { crud as eduCrud, listPublic as eduList, reorder as eduReorder } from '../controllers/educationController.js'
import { crud as testimonialCrud, listPublic as testimonialList, reorder as testimonialReorder } from '../controllers/testimonialController.js'
import { create as inquiryCreate, list as inquiryList, getOne as inquiryGet, update as inquiryUpdate, remove as inquiryRemove, stats as inquiryStats } from '../controllers/inquiryController.js'
import { listPublic as resumeList, upload as resumeUpload, incrementDownload, setActive } from '../controllers/resumeController.js'
import { listPublic as blogList, getBySlug as blogSlug, incrementViews as blogViews } from '../controllers/blogController.js'
import { overview, projectViews, track, traffic, topPages } from '../controllers/analyticsController.js'
import { get as settingsGet, update as settingsUpdate, uploadImage as settingsUpload } from '../controllers/settingsController.js'
import { crud as projectCrud } from '../controllers/projectController.js'
import { crud as blogCrud } from '../controllers/blogController.js'
import { crud as resumeCrud } from '../controllers/resumeController.js'
import { authenticate as authOnly } from '../middleware/auth.js'

import { upload, handleUpload } from '../middleware/upload.js'

const router = Router()
router.use(apiLimiter)

// ─── Public routes ─────────────────────────────────
router.get('/projects', listPublic)
router.get('/projects/:slug', getBySlug)
router.post('/projects/:slug/views', incrementViews)

router.get('/skills', skillList)
router.get('/experience', expList)
router.get('/education', eduList)
router.get('/testimonials', testimonialList)
router.get('/resume', resumeList)
router.post('/resume/:id/download', incrementDownload)
router.get('/blog', blogList)
router.get('/blog/:slug', blogSlug)
router.post('/blog/:slug/views', blogViews)
router.get('/settings', settingsGet)
router.post('/inquiries', inquiryLimiter, inquiryValidation, inquiryCreate)
router.post('/analytics/track', track)
router.get('/analytics/traffic', traffic)
router.get('/analytics/top-pages', topPages)
router.get('/analytics/projects', projectViews)

// ─── Admin auth routes ─────────────────────────────
import authRoutes from './auth.js'
router.use('/auth', authRoutes)

// ─── Protected admin routes ────────────────────────
router.post('/upload', uploadLimiter, upload, handleUpload, uploadImage)
router.post('/upload/settings', uploadLimiter, upload, handleUpload, settingsUpload)

router.get('/admin/projects', authenticate, projectCrud.list)
router.post('/admin/projects', authenticate, projectValidation, projectCrud.create)
router.put('/admin/projects/:id', authenticate, projectValidation, projectCrud.update)
router.delete('/admin/projects/:id', authenticate, projectCrud.delete)
router.post('/admin/projects/:id/upload', authenticate, uploadLimiter, upload, handleUpload, uploadImage)

router.get('/admin/skills', authenticate, skillCrud.list)
router.post('/admin/skills', authenticate, skillValidation, skillCrud.create)
router.put('/admin/skills/:id', authenticate, skillValidation, skillCrud.update)
router.delete('/admin/skills/:id', authenticate, skillCrud.delete)
router.put('/admin/skills/reorder', authenticate, skillReorder)

router.get('/admin/experience', authenticate, expCrud.list)
router.post('/admin/experience', authenticate, experienceValidation, expCrud.create)
router.put('/admin/experience/:id', authenticate, experienceValidation, expCrud.update)
router.delete('/admin/experience/:id', authenticate, expCrud.delete)
router.put('/admin/experience/reorder', authenticate, expReorder)

router.get('/admin/education', authenticate, eduCrud.list)
router.post('/admin/education', authenticate, educationValidation, eduCrud.create)
router.put('/admin/education/:id', authenticate, educationValidation, eduCrud.update)
router.delete('/admin/education/:id', authenticate, eduCrud.delete)
router.put('/admin/education/reorder', authenticate, eduReorder)

router.get('/admin/testimonials', authenticate, testimonialCrud.list)
router.post('/admin/testimonials', authenticate, testimonialValidation, testimonialCrud.create)
router.put('/admin/testimonials/:id', authenticate, testimonialValidation, testimonialCrud.update)
router.delete('/admin/testimonials/:id', authenticate, testimonialCrud.delete)
router.put('/admin/testimonials/reorder', authenticate, testimonialReorder)

router.get('/admin/inquiries', authenticate, inquiryList)
router.get('/admin/inquiries/stats', authenticate, inquiryStats)
router.get('/admin/inquiries/:id', authenticate, inquiryGet)
router.put('/admin/inquiries/:id', authenticate, inquiryUpdate)
router.delete('/admin/inquiries/:id', authenticate, inquiryRemove)

router.get('/admin/resume', authenticate, resumeCrud.list)
router.post('/admin/resume', authenticate, uploadLimiter, upload, handleUpload, resumeUpload)
router.put('/admin/resume/:id', authenticate, resumeCrud.update)
router.delete('/admin/resume/:id', authenticate, resumeCrud.delete)
router.put('/admin/resume/:id/active', authenticate, setActive)

router.get('/admin/blog', authenticate, blogCrud.list)
router.post('/admin/blog', authenticate, blogValidation, blogCrud.create)
router.put('/admin/blog/:id', authenticate, blogValidation, blogCrud.update)
router.delete('/admin/blog/:id', authenticate, blogCrud.delete)

router.get('/admin/analytics/overview', authenticate, overview)

router.put('/admin/settings', authenticate, settingsUpdate)

export default router