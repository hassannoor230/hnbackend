export const createCRUD = (Model, populate) => {
  const list = async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50))
      const skip = (page - 1) * limit
      const filter = {}
      if (req.query.visible !== undefined) filter.visible = req.query.visible === 'true'
      if (req.query.published !== undefined) filter.published = req.query.published === 'true'
      if (req.query.search) filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { name: new RegExp(req.query.search, 'i') },
        { company: new RegExp(req.query.search, 'i') },
        { clientName: new RegExp(req.query.search, 'i') },
        { degree: new RegExp(req.query.search, 'i') },
      ]
      const [items, total] = await Promise.all([
        Model.find(filter).sort(req.query.sort ? JSON.parse(req.query.sort) : { displayOrder: 1, createdAt: -1 }).skip(skip).limit(limit).populate(populate || ''),
        Model.countDocuments(filter),
      ])
      res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) } })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  }

  const getOne = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id).populate(populate || '')
      if (!item) return res.status(404).json({ success: false, message: 'Item not found.' })
      res.json({ success: true, data: item })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  }

  const create = async (req, res) => {
    try {
      const item = await Model.create(req.body)
      res.status(201).json({ success: true, data: item })
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(400).json({ success: false, message: `${field} already exists.` })
      }
      res.status(400).json({ success: false, message: err.message || 'Failed to create item.' })
    }
  }

  const update = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'Item not found.' })
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      res.json({ success: true, data: updated })
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(400).json({ success: false, message: `${field} already exists.` })
      }
      res.status(400).json({ success: false, message: err.message || 'Failed to update item.' })
    }
  }

  const remove = async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'Item not found.' })
      res.json({ success: true, message: 'Item deleted.' })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  }

  return { list, getOne, create, update, remove }
}