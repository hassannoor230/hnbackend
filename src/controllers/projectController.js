import { createCRUD } from '../services/crud.js'
import Project from '../models/Project.js'
import cloudinary from '../config/cloudinary.js'

export const crud = createCRUD(Project)

export const getBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    res.json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const incrementViews = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    project.views = (project.views || 0) + 1
    await project.save()
    res.json({ success: true, data: { views: project.views } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const listPublic = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const skip = (page - 1) * limit
    const filter = { published: true }
    if (req.query.featured === 'true') filter.featured = true
    if (req.query.category) filter.category = req.query.category
    const sort = req.query.sort === 'newest' ? { createdAt: -1 } : { displayOrder: 1, createdAt: -1 }
    const [items, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(limit).select('-gallery -problem -solution -features -results -process'),
      Project.countDocuments(filter),
    ])
    res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })
    const folder = req.body.folder || 'portfolio/projects'
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })
    res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed.' })
  }
}

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body
    if (!publicId) return res.status(400).json({ success: false, message: 'publicId is required.' })
    await cloudinary.uploader.destroy(publicId)
    res.json({ success: true, message: 'Image deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}