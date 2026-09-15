import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true },
    method: { type: String, default: 'page' },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    country: { type: String, default: '' },
    device: { type: String, default: 'unknown' },
    date: { type: String, index: true },
    hour: { type: Number, default: 0 },
  },
  { timestamps: true },
)

analyticsSchema.index({ path: 1, createdAt: -1 })
analyticsSchema.index({ date: -1 })

export default mongoose.model('Analytics', analyticsSchema)