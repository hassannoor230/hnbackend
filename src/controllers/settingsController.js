import Settings from '../models/Settings.js'
import cloudinary from '../config/cloudinary.js'

export const get = async (req, res) => {
  try {
    let settings = await Settings.findOne({ singleton: true })
    if (!settings) settings = await Settings.create({})
    res.json({ success: true, data: settings })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const update = async (req, res) => {
  try {
    let settings = await Settings.findOne({ singleton: true })
    if (!settings) settings = new Settings({ singleton: true })
    Object.assign(settings, req.body)
    await settings.save()
    res.json({ success: true, data: settings })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })
    const folder = req.body.folder || 'portfolio/settings'
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })
    res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed.' })
  }
}