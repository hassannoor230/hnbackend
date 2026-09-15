import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: [true, 'Degree/Course is required'], trim: true, index: true },
    institute: { type: String, required: [true, 'Institute is required'], trim: true },
    year: { type: String, trim: true },
    description: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

educationSchema.index({ visible: -1, displayOrder: 1 })

export default mongoose.model('Education', educationSchema)