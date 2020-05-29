const Review = require('../models/Review')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')

// @desc   Get reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedQuery)
  }
})
// @desc   Get single review
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })
  res.status(200).json({
    success: true,
    data: review
  })
})
// @desc   Add review
// @route  POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) return next(new ErrorResponse('No bootcamp found', 404))

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review
  })
})

// @desc   Update review
// @route  GET /api/v1/reviews/:id
// @access Public
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)
  if (!review) return next(new ErrorResponse('Review not found', 404))

  // make sure user is the owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to update review to ${review._id}!`, 401))
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    success: true,
    data: review
  })
})
// @desc   Delete course
// @route  DELETE /api/v1/courses/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`), 404)
  }
  // make sure user is the owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to delete review ${review._id}!`, 403))
  }
  await review.remove()
  res.status(200).json({
    success: true,
    data: {}
  })
})
