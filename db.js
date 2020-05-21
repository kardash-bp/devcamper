const mongoose = require('mongoose')

class Database {
  constructor () {
    this.connect()
  }

  async connect () {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      console.log(`MongoDB Connected ${conn.connection.host}`)
    } catch (err) {
      console.log('error: ', err.message)
    }
  }
}

module.exports = new Database()
