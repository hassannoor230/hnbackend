import { createCRUD } from '../services/crud.js'
import Testimonial from '../models/Testimonial.js'

export const crud = createCRUD(Testimonial)

export const listPublic = async (req, res) => {
  try {
    const items = await Testimonial.find({ visible: true }).sort({ displayOrder: 1, createdAt: 1 })
    res.json({ success: true, data: items })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

export const reorder = async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items)) return res.status(400).json({ success: false, message: 'items array required.' })
    const ops = items.map((item, i) => ({
      updateOne: { filter: { _id: item.id }, update: { displayOrder: item.displayOrder ?? i } },
    }))
    await Testimonial.bulkWrite(ops)
    const updated = await Testimonial.find().sort({ displayOrder: 1 })
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}