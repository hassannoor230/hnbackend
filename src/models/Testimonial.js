import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: [true, 'Client name is required'], trim: true, index: true },
    position: { type: String, trim: true },
    company: { type: String, trim: true },
    review: { type: String, required: [true, 'Review is required'], trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5, index: true },
    clientImage: { type: String, default: '' },
    visible: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
)

testimonialSchema.index({ visible: -1, displayOrder: 1 })

export default mongoose.model('Testimonial', testimonialSchema)