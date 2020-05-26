const path = require('path')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuery)
})
// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp not found !', 404))
  }
  res.status(200).json({ success: true, data: bootcamp })
})
// @desc   Create  bootcamp
// @route  POST /api/v1/bootcamps
// @access Public

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to body
  req.body.user = req.user.id
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(new ErrorResponse('You already have published bootcamp', 400))
  }
  const bootcamp = await Bootcamp.create(req.body)
  // same as const bootcamp = new Bootcamp(req.body).save()
  res.status(201).json(bootcamp)
})
// @desc   Update  bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp not found !', 404))
  }
  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('User is not authorized to update this bootcamp!', 403))
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  res.status(200).json(bootcamp)
})
// @desc   Delete  bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp not found !', 404))
  }
  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('User is not authorized to delete this bootcamp!', 403))
  }
  bootcamp.remove()
  res.status(200).json({ success: true, data: bootcamp })
})
// @desc   Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcamsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude
  // calc radius using radians
  // Divide dist by radius of Earth 6378km
  const radius = distance / 6378

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat], radius
        ]
      }
    }
  })
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc   Delete all bootcamp data
// @route  DELETE /api/v1/bootcamps/
// @access Private

exports.deleteAllBootcamp = asyncHandler(async (req, res, next) => {
  await Bootcamp.deleteMany()

  res.status(200).json({ success: true })
})

// @desc   Upload  bootcamp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access Private

exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp not found !', 404))
  }
  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('User is not authorized to update this bootcamp!', 403))
  }
  if (!req.files) {
    return next(new ErrorResponse('Please upload a photo', 400))
  }
  const photo = req.files.photo
  if (!photo.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload a photo', 400))
  } else if (photo.size > process.env.MAX_FILE_SIZE) {
    return next(new ErrorResponse(`Please upload a photo less than ${process.env.MAX_FILE_SIZE}`, 400))
  }
  // create custom filename
  photo.name = `photo_${bootcamp._id}${path.parse(photo.name).ext}`
  photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse('Problem with file upload', 500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: photo.name })
    res.status(200).json({
      success: true,
      data: photo.name
    })
  })
})
