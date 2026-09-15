import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Design', 'Mobile', 'Other'],
      default: 'Other',
      index: true,
    },
    level: { type: Number, min: 0, max: 100, default: 80 },
    icon: { type: String, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

skillSchema.index({ visible: -1, displayOrder: 1 })

export default mongoose.model('Skill', skillSchema)