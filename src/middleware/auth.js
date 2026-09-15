import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import Admin from '../models/Admin.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken || req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }
    const decoded = jwt.verify(token, env.jwtSecret)
    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account is not active.' })
    }
    req.admin = admin
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' })
  }
}

export const protect = authenticate

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions.' })
    }
    next()
  }
}

export const requireAdmin = requireRole('admin')

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken || req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      const decoded = jwt.verify(token, env.jwtSecret)
      req.admin = await Admin.findById(decoded.id).select('-password')
    }
  } catch {
    // ignore
  }
  next()
}