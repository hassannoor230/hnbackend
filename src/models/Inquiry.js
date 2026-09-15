import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true, index: true },
    subject: { type: String, trim: true, default: '' },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    projectType: { type: String, trim: true, default: '' },
    budget: { type: String, trim: true, default: '' },
    timeline: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'], default: 'NEW', index: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM', index: true },
    repliedAt: { type: Date },
    archivedAt: { type: Date },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true },
)

inquirySchema.index({ createdAt: -1 })
inquirySchema.index({ status: 1, priority: -1, createdAt: -1 })

export default mongoose.model('Inquiry', inquirySchema)