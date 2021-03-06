const mongoose = require('mongoose')
const db = 'mongodb://crazy8:vs48yxCeKy0@173.82.255.6/bb'

const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchema = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }

  mongoose.connect(db, {useNewUrlParser: true}, err => {
    console.log(err ? 'Conect Error' + err : 'Connection Success')
  })
}

// ;(async () => {
//   this.connect()
//   this.initSchema()
//
//   // const User = mongoose.model('User')
//   // const users = await User.find({})
//
//   const Movie = mongoose.model('Movie')
//   const movies = await Movie.find({})
//
//   console.log(movies)
// })()