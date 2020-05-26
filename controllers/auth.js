const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role
  } = req.body
  // create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })
  sendTokenResponse(user, 201, res)
})

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return next(new ErrorResponse('Please provide credentials', 400))
  // Validate credentials
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  // check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  sendTokenResponse(user, 200, res)
})

// @desc   Get current logged user
// @route  POST /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: req.user
  })
})
// @desc   Forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new ErrorResponse('There is no user with that email', 404))
  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset password token',
      message
    })
    res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (err) {
    console.log(err.message)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// Get token from model
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    })
}
