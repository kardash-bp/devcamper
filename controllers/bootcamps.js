const Bootcamp = require('../models/Bootcamp')

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Puplic

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (e) {
    console.log('error: ', e.message)
    res.status(400).json({ success: false })
  }
}
// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access Puplic

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
      return res.status(404).json({ success: false })
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (e) {
    console.log(e.message)
    res.status(400).json({ success: false })
  }
}
// @desc   Create  bootcamp
// @route  POST /api/v1/bootcamps
// @access Puplic

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    // same as const bootcamp = new Bootcamp(req.body).save()
    res.status(201).json(bootcamp)
  } catch (e) {
    console.log('error: ', e.message)
    res.status(500).json({ success: false })
  }
}
// @desc   Update  bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Puplic

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!bootcamp) {
      return res.status(400).json({ success: false })
    }
  } catch (e) {
    res.status(500).json({ success: false })
  }
}
// @desc   Delete  bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Puplic

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
      return res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (e) {
    res.status(500).json({ success: false })
  }
}
