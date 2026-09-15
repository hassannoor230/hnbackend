import { createCRUD } from '../services/crud.js'
import Resume from '../models/Resume.js'
import cloudinary from '../config/cloudinary.js'

export const crud = createCRUD(Resume)

export const listPublic = async (req, res) => {
  try {
    const resume = await Resume.findOne({ active: true }).sort({ createdAt: -1 })
    res.json({ success: true, data: resume })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })
    const { title, fileName, fileSize, mimeType } = req.body
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio/resume',
      resource_type: 'raw',
    })
    const resume = await Resume.create({
      title: title || 'Resume',
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileName: fileName || req.file.originalname,
      fileSize: fileSize ? parseInt(fileSize, 10) : req.file.size,
      mimeType: mimeType || req.file.mimetype,
      active: true,
      uploadedBy: req.admin?._id,
    })
    await Resume.updateMany({ _id: { $ne: resume._id } }, { active: false })
    res.status(201).json({ success: true, data: resume })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed.' })
  }
}

export const incrementDownload = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' })
    resume.downloads = (resume.downloads || 0) + 1
    await resume.save()
    res.json({ success: true, data: { downloads: resume.downloads } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const setActive = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' })
    await Resume.updateMany({ _id: { $ne: resume._id } }, { active: false })
    resume.active = true
    await resume.save()
    res.json({ success: true, data: resume })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}