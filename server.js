const express = require('express')
const morgan = require('morgan')
// imports
require('./db')
const bootcamps = require('./routes/bootcamps')

const app = express()
app.use(express.json())
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

app.listen(process.env.PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))
