import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, default: 'Resume' },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: 'application/pdf' },
    active: { type: Boolean, default: false, index: true },
    downloads: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true },
)

resumeSchema.index({ active: -1, createdAt: -1 })

export default mongoose.model('Resume', resumeSchema)