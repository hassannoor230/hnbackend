import { Router } from 'express'
import apiRoutes from './api.js'
import dashboardRoutes from './dashboard.js'

const router = Router()
router.use('/', apiRoutes)
router.use('/admin', dashboardRoutes)

export default router