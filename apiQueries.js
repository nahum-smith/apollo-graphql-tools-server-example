import uuidv1 from 'uuid/v1'
import uuidv4 from 'uuid/v4'
import db from './database'

export async function findOne (collection, query = {}) {
  return db.get().collection(collection).findOne(query).then(doc => doc)
}
export async function findAll (collection) {
  return db.get().collection(collection).find({}).toArray().then((docs) => docs)
}
export async function findBy (collection, query = {}, options = {}) {
  return db.get().collection(collection).find(query, options).toArray().then(docs => docs)
}
export async function addNewUser (doc = {}, options = {}) {
  var usersColl = db.get().collection('users')
  var newUUID = uuidv1()
  var startingProperties = {
    userID: newUUID,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    quizzes: [],
    questions: []
  }
  doc = Object.assign({}, doc, startingProperties)
  console.log(doc)
  var user = await usersColl.insertOne(doc, options).then((res) => {
    return usersColl.findOne({_id: res.insertedId})
      .then(doc => doc)
  })
  return user
}
export async function addNewQuestion (doc = {}, options = {}) {
  var quesColl = db.get().collection('questions')
  var UUID = uuidv4()
  doc = Object.assign({}, doc, {questionID: UUID})
  var question = await quesColl.insertOne(doc, options).then((res) => {
    return quesColl.findOne({_id: res.insertedId})
    .then(doc => doc)
  })
  return question
}
const insertOneInCollection = async (collection, query = {}) => {
  return db.collection(collection)
  .findOneAndUpdate(query, query, {upsert: true, returnOriginal: false})
    .then(res => res.value)
    .catch(err => err)
}
const updateOneInCollection = async (collection, query = {}, update = {}) => {
  return db.collection(collection).findOneAndUpdate(query, update)
    .then(res => res)
    .catch(err => err)
}
