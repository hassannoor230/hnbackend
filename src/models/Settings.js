import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    singleton: { type: Boolean, default: true, unique: true },
    siteName: { type: String, default: 'Hassan Noor', trim: true },
    headline: { type: String, default: 'MERN Stack Developer', trim: true },
    bio: { type: String, default: '', trim: true },
    email: { type: String, default: 'hassannoor2309@gmail.com', trim: true },
    location: { type: String, default: 'Pakistan', trim: true },
    availability: { type: String, default: 'Open to Work', trim: true },
    profileImage: { type: String, default: '' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      other: { type: String, default: '' },
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    contact: {
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    analytics: {
      googleTagId: { type: String, default: '' },
      plausibleDomain: { type: String, default: '' },
    },
  },
  { timestamps: true },
)

export default mongoose.model('Settings', settingsSchema)