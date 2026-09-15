import mongoose from 'mongoose'
import { env } from './env.js'

let cached = null

export default async function connectDB() {
  if (cached) return cached
  try {
    cached = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
    })
    console.log(`MongoDB connected: ${env.mongoUri}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
  return cached
}