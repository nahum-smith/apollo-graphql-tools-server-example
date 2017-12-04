var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = async function (url, done) {
  if (state.db) return done()

  return MongoClient.connect(url)
    .then(db => {
      state.db = db
      return {dbName: db.databaseName}
    })
    .catch(err => err)
}

exports.get = function () {
  console.info('making DB call')
  return state.db
}

exports.close = function (done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}
