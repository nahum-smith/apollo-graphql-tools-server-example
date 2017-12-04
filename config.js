var config = module.exports

var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 8080,
  ip: '127.0.0.1'
}

config.mongodb = {
  root: 'mongodb://',
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost',
  dbName: 'text2learn'
}
if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}
