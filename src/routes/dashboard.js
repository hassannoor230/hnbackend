import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'
import { crud as projectCrud } from '../controllers/projectController.js'
import { crud as skillCrud } from '../controllers/skillController.js'
import { crud as expCrud } from '../controllers/experienceController.js'
import { crud as eduCrud } from '../controllers/educationController.js'
import { crud as testimonialCrud } from '../controllers/testimonialController.js'
import { crud as blogCrud } from '../controllers/blogController.js'
import { crud as resumeCrud } from '../controllers/resumeController.js'
import { list as inquiryList, stats as inquiryStats } from '../controllers/inquiryController.js'
import { overview, projectViews, traffic, topPages, analyticsSummary } from '../controllers/analyticsController.js'
import { get as settingsGet, update as settingsUpdate } from '../controllers/settingsController.js'

const router = Router()
router.use(authenticate)

router.get('/overview', overview)
router.get('/projects', projectCrud.list)
router.get('/skills', skillCrud.list)
router.get('/experience', expCrud.list)
router.get('/education', eduCrud.list)
router.get('/testimonials', testimonialCrud.list)
router.get('/blog', blogCrud.list)
router.get('/resume', resumeCrud.list)
router.get('/inquiries', inquiryList)
router.get('/inquiries/stats', inquiryStats)
router.get('/analytics', analyticsSummary)
router.get('/analytics/traffic', traffic)
router.get('/analytics/top-pages', topPages)
router.get('/analytics/projects', projectViews)
router.get('/settings', settingsGet)
router.put('/settings', requireRole('admin'), settingsUpdate)

export default router