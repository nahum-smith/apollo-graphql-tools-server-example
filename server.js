import express from 'express'
import { makeExecutableSchema } from 'graphql-tools'
import graphqlHTTP from 'express-graphql'
import db from './database'
import { addNewUser, findOne, findAll } from './apiQueries'
import { GraphQLDateTime } from 'graphql-iso-date'
const config = require('./config.js')
const MONGO_URL = `${config.mongodb.root}${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.dbName}`

console.log({starting: true})

db.connect(MONGO_URL)
.then((res) => {
  console.log({mongoDB_connected: true, dbName: res.dbName})

  const typeDefs = `
    scalar ISODate
    type User {
      userID: String!
      email: String
      password: String
      ani: String!
      status: Int!
      createdAt: ISODate
      updatedAt: ISODate
      quizzes: [Quiz]
      questions: [Question]
    }
    type Question {
      questionID: Int
      text: String
      answer: String
      type: Boolean
      tags: [String]
    }
    type StatsObj {

    }
    type Quiz {
      quizID: Int!
      name: String!
      createdAt: ISODate
      updateAt: ISODate
      questions: [Question]
      stats: StatsObj
      numQuestions: Int
    }
    # the schema allows the following query:
    type Query {
      users: [User]
      user(ani: String!): User
      questions: [Question]
      question(questionID: Int!): Question
    }
    type Mutation {
      addUser (
        ani: String!
      ): User
    }
  `
  // Define Resolver functions
  const resolvers = {
    Query: {
      users: () => findAll('users'),
      user: (_, {ani}) => findOne('users', {ani: ani}),
      questions: () => findAll('questions'),
      question: (_, {questionID}) => findOne('questions', {questionID: questionID})
    },
    Mutation: {
      addUser: (_, {ani}) => addNewUser({ani: ani})
    },
    ISODate: GraphQLDateTime
  }

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  const app = express()
  const logger = { log: (e) => console.log(e) }

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    logger,
    graphiql: true }))

  app.listen(3300, () => {
    console.log({server_listening: true})
  })
})
