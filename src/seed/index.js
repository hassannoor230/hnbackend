import connectDB from '../config/db.js'
import Admin from '../models/Admin.js'
import Settings from '../models/Settings.js'
import bcrypt from 'bcryptjs'

const runSeed = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hassannoor.dev'
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123456'
    const exists = await Admin.findOne({ email: adminEmail })
    if (!exists) {
      const hashed = await bcrypt.hash(adminPass, 12)
      await Admin.create({ name: 'Hassan Noor', email: adminEmail, password: hashed, role: 'admin' })
      console.log(`Admin created: ${adminEmail}`)
    } else {
      console.log('Admin already exists.')
    }

    const settingsExists = await Settings.findOne({ singleton: true })
    if (!settingsExists) {
      await Settings.create({
        siteName: 'Hassan Noor',
        headline: 'MERN Stack Developer',
        bio: 'I build high-performance, scalable web applications with a focus on clean design and user experience.',
        email: 'hassannoor2309@gmail.com',
        location: 'Pakistan',
        availability: 'Open to Work',
        socials: {
          github: 'https://github.com/hassannoor230',
          linkedin: 'https://www.linkedin.com/in/hassan-noor-509794325/',
          instagram: 'https://instagram.com/rana_hassannoor',
        },
        seo: {
          title: 'Hassan Noor — MERN Stack Developer',
          description: 'Portfolio of Hassan Noor, a MERN Stack Developer building premium web applications.',
        },
      })
      console.log('Default settings created.')
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

export default runSeed