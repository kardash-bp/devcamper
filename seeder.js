const fs = require('fs')
const mongoose = require('mongoose')
require('./db')
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_resources/_data/courses.json`, 'utf-8'))

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
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
