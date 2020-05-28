const express = require('express')
const {
  getBootcamp,
  getBootcamps,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  deleteAllBootcamp,
  getBootcamsInRadius,
  uploadPhotoBootcamp
} = require('../controllers/bootcamps')
const Bootcamp = require('../models/Bootcamp')
const advancedQuery = require('../middleware/advancedQuery')
// Include other resource routers
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')
const router = express.Router()

const { protect, authorize } = require('../middleware/auth')
// Re-route
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router
  .route('/')
  .get(advancedQuery(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp)
  .delete(protect, deleteAllBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcamsInRadius)

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadPhotoBootcamp)
module.exports = router
