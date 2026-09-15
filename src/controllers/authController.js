import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import Admin from '../models/Admin.js'
import { sendMail } from '../config/email.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password')
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account is disabled.' })
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
      maxAge: env.cookieExpiresIn * 24 * 60 * 60 * 1000,
      path: '/',
    })
    admin.lastLogin = new Date()
    await admin.save()
    res.json({ success: true, message: 'Login successful.', data: { token, admin: admin.toSafeObject() } })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('adminToken', { path: '/' })
  res.json({ success: true, message: 'Logged out successfully.' })
}

export const me = (req, res) => {
  res.json({ success: true, data: req.admin.toSafeObject() })
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await Admin.findById(req.admin._id).select('+password')
    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
    }
    admin.password = newPassword
    await admin.save()
    res.json({ success: true, message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body
    const admin = await Admin.findById(req.admin._id)
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' })
    if (name) admin.name = name
    if (email && email.toLowerCase() !== admin.email) {
      const exists = await Admin.findOne({ email: email.toLowerCase() })
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use.' })
      admin.email = email.toLowerCase()
    }
    if (avatar !== undefined) admin.avatar = avatar
    await admin.save()
    res.json({ success: true, message: 'Profile updated.', data: admin.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}