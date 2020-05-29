const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const xss = require('xss-clean')
const expressRate = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const sanitize = require('express-mongo-sanitize')
// imports
const errorHandler = require('./middleware/error')
require('./db')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
// sanitize data prevent SQL injection
app.use(sanitize())
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(fileupload())
// set security headers
app.use(helmet())
// prevent XSS attacks
app.use(xss())
// Rate limit
const limiter = expressRate({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
})
app.use(limiter)
// Prevent http param pollution
app.use(hpp())
// Enable CORS
app.use(cors())
// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

app.listen(process.env.PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))
