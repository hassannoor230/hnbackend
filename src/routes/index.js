import { Router } from 'express'
import apiRoutes from './api.js'
import dashboardRoutes from './dashboard.js'

const router = Router()
router.use('/api', apiRoutes)
router.use('/api/admin', dashboardRoutes)

export default router