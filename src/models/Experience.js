import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, 'Company is required'], trim: true, index: true },
    position: { type: String, required: [true, 'Position is required'], trim: true },
    description: { type: String, default: '' },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    current: { type: Boolean, default: false, index: true },
    technologies: [{ type: String, trim: true }],
    displayOrder: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

experienceSchema.index({ visible: -1, displayOrder: 1 })

export default mongoose.model('Experience', experienceSchema)