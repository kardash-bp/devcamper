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
const router = express.Router()
// Re-route
router.use('/:bootcampId/courses', courseRouter)

router
  .route('/')
  .get(advancedQuery(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp)
  .delete(deleteAllBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcamsInRadius)

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/:id/photo').put(uploadPhotoBootcamp)
module.exports = router
