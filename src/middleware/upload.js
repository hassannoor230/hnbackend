import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(process.cwd(), 'uploads')

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname).toLowerCase())
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /(\.pdf|\.png|\.jpe?g|\.webp)$/i
  if (allowed.test(file.originalname)) cb(null, true)
  else cb(new Error('Only PDF and image files are allowed.'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

export const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large. Max 10MB.' })
      return res.status(400).json({ success: false, message: err.message })
    }
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}

export default { upload, handleUpload }