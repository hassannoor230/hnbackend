import Analytics from '../models/Analytics.js'
import Project from '../models/Project.js'
import Inquiry from '../models/Inquiry.js'
import Resume from '../models/Resume.js'

export const overview = async (req, res) => {
  try {
    const [projects, featuredProjects, unreadInquiries, testimonials, totalDownloads, totalBlogs] = await Promise.all([
      Project.countDocuments({ published: true }),
      Project.countDocuments({ featured: true, published: true }),
      Inquiry.countDocuments({ status: 'NEW' }),
      (await import('../models/Testimonial.js')).default.countDocuments({ visible: true }),
      Resume.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]),
      (await import('../models/Blog.js')).default.countDocuments({ published: true }),
    ])
    res.json({
      success: true,
      data: {
        totalProjects: projects,
        featuredProjects,
        unreadInquiries,
        totalTestimonials: testimonials,
        resumeDownloads: totalDownloads[0]?.total || 0,
        publishedBlogs: totalBlogs,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const projectViews = async (req, res) => {
  try {
    const items = await Project.find({ published: true }).sort({ views: -1 }).limit(10).select('title views slug')
    res.json({ success: true, data: items })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const track = async (req, res) => {
  try {
    const { path, method = 'page', referrer = '', ip = '', userAgent = '', country = '', device = 'unknown' } = req.body
    if (!path) return res.status(400).json({ success: false, message: 'path is required.' })
    const date = new Date().toISOString().slice(0, 10)
    const hour = new Date().getHours()
    await Analytics.create({ path, method, referrer, ip, userAgent, country, device, date, hour })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const traffic = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().slice(0, 10)
    const pipeline = [
      { $match: { date: { $gte: sinceStr } } },
      { $group: { _id: '$date', views: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
    const data = await Analytics.aggregate(pipeline)
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const topPages = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().slice(0, 10)
    const data = await Analytics.aggregate([
      { $match: { date: { $gte: sinceStr } } },
      { $group: { _id: '$path', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 15 },
    ])
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}