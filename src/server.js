import resolvers from './graphql/resolvers/resolver'
import schema from './graphql/schemas/index.gql';

const config           = require('config')
const express          = require('express')
const mongoose         = require('mongoose')
const { ApolloServer, UserInputError } = require('apollo-server-express')
const { seedUsers }    = require('./db-init')

mongoose.Promise       = global.Promise

mongoose.connect(config.get('db.uri'), { useNewUrlParser: true, useFindAndModify: false })
  .then(async () => {
    console.log('INFO: Connected to the database')

    await seedUsers()

    // TODO: Initialize Apollo with the required arguments as you see fit
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers,
      engine: {
        rewriteError(err) {
          if (err instanceof UserInputError) {
            return err.message;
          }
          return err;
        }
      },
      debug: false
    })

    const app = express()
    server.applyMiddleware({ app })

    const { host, port } = config.get('server')

    app.listen({ port }, () => {
      console.log(`Server ready at http://${host}:${port}${server.graphqlPath}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
