import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    avatar: { type: String, default: '' },
  },
  { timestamps: true },
)

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const isBcryptHash = typeof this.password === 'string' && /^\$2[aby]\$/.test(this.password)
  if (isBcryptHash) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

adminSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

export default mongoose.model('Admin', adminSchema)