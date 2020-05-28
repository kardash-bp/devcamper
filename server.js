const express = require('express')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
// imports
const errorHandler = require('./middleware/error')
require('./db')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(fileupload())

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use(errorHandler)

app.listen(process.env.PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))
