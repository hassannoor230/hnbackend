import { createCRUD } from '../services/crud.js'
import Blog from '../models/Blog.js'

export const crud = createCRUD(Blog)

export const getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' })
    res.json({ success: true, data: blog })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' })
    blog.views = (blog.views || 0) + 1
    await blog.save()
    res.json({ success: true, data: { views: blog.views } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const listPublic = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit
    const filter = { published: true }
    if (req.query.category) filter.category = req.query.category
    if (req.query.tag) filter.tags = req.query.tag
    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).select('-content'),
      Blog.countDocuments(filter),
    ])
    res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const create = async (req, res) => {
  try {
    const data = { ...req.body, author: req.admin?._id }
    if (data.published && !data.publishedAt) data.publishedAt = new Date()
    const blog = await Blog.create(data)
    res.status(201).json({ success: true, data: blog })
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists.' })
    res.status(400).json({ success: false, message: err.message || 'Failed to create blog.' })
  }
}

export const update = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' })
    if (req.body.published && !blog.publishedAt) req.body.publishedAt = new Date()
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.json({ success: true, data: updated })
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Slug already exists.' })
    res.status(400).json({ success: false, message: err.message || 'Failed to update blog.' })
  }
}