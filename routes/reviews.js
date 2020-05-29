const express = require('express')

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews')
const Review = require('../models/Review')
const advancedQuery = require('../middleware/advancedQuery')
const router = express.Router({ mergeParams: true })

const { protect, authorize } = require('../middleware/auth')

router
  .route('/')
  .get(advancedQuery(Review, {
    path: 'bootcamp',
    select: 'name description'
  }), getReviews)
  .post(protect, authorize('user', 'admin'), addReview)
router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('publisher', 'admin'), updateReview)
  .delete(protect, authorize('publisher', 'admin'), deleteReview)
module.exports = router
