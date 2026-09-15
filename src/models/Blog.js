import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: [true, 'Content is required'] },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true, default: 'General' },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    views: { type: Number, default: 0 },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { timestamps: true },
)

blogSchema.index({ published: -1, publishedAt: -1 })
blogSchema.index({ createdAt: -1 })

export default mongoose.model('Blog', blogSchema)