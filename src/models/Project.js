import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'], trim: true, index: true },
    year: { type: String, trim: true, index: true },
    technologies: [{ type: String, trim: true }],
    thumbnail: { type: String, default: '' },
    gallery: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    views: { type: Number, default: 0 },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    features: [{ type: String }],
    results: { type: String, default: '' },
    process: { type: String, default: '' },
    client: { type: String, default: '' },
    projectType: { type: String, default: '' },
  },
  { timestamps: true },
)

projectSchema.index({ displayOrder: 1, createdAt: -1 })
projectSchema.index({ featured: -1, displayOrder: 1 })

export default mongoose.model('Project', projectSchema)