import Inquiry from '../models/Inquiry.js'
import { sendMail } from '../config/email.js'

export const create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    }
    const inquiry = await Inquiry.create(data)
    const html = `
      <h2>New Portfolio Inquiry</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Subject:</strong> ${inquiry.subject || 'N/A'}</p>
      <p><strong>Project Type:</strong> ${inquiry.projectType || 'N/A'}</p>
      <p><strong>Budget:</strong> ${inquiry.budget || 'N/A'}</p>
      <p><strong>Timeline:</strong> ${inquiry.timeline || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${inquiry.message}</p>
    `
    await sendMail({ to: process.env.EMAIL_TO || 'hassannoor2309@gmail.com', subject: `New Inquiry: ${inquiry.subject || 'Portfolio Message'}`, html })
    res.status(201).json({ success: true, data: { id: inquiry._id } })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to submit inquiry.' })
  }
}

export const list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const skip = (page - 1) * limit
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.priority) filter.priority = req.query.priority
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') },
        { subject: new RegExp(req.query.search, 'i') },
      ]
    }
    const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 } }
    const sort = sortMap[req.query.sort] || { createdAt: -1 }
    const [items, total] = await Promise.all([
      Inquiry.find(filter).sort(sort).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ])
    res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const getOne = async (req, res) => {
  try {
    const item = await Inquiry.findById(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    res.json({ success: true, data: item })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const update = async (req, res) => {
  try {
    const item = await Inquiry.findById(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    if (req.body.status === 'REPLIED' && item.status !== 'REPLIED') item.repliedAt = new Date()
    if (req.body.status === 'ARCHIVED') item.archivedAt = new Date()
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to update inquiry.' })
  }
}

export const remove = async (req, res) => {
  try {
    const item = await Inquiry.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
    res.json({ success: true, message: 'Inquiry deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const stats = async (req, res) => {
  try {
    const [total, newCount, readCount, repliedCount, archivedCount] = await Promise.all([
      Inquiry.countDocuments({}),
      Inquiry.countDocuments({ status: 'NEW' }),
      Inquiry.countDocuments({ status: 'READ' }),
      Inquiry.countDocuments({ status: 'REPLIED' }),
      Inquiry.countDocuments({ status: 'ARCHIVED' }),
    ])
    res.json({ success: true, data: { total, new: newCount, read: readCount, replied: repliedCount, archived: archivedCount } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}