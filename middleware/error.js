const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  console.log(err)
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found.'
    error = new ErrorResponse(message, 404)
  }
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate key entered!'
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler
