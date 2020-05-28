const fs = require('fs')
const mongoose = require('mongoose')
require('./db')
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/reviews.json`, 'utf-8'))

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log('Data imported')
    process.exit()
  } catch (err) {
    console.log(err.message)
  }
}
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('Data wipeout')
    process.exit()
  } catch (err) {
    console.log(err.message)
  }
}
if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
} else {
  console.log('i od d')
  process.exit()
}
