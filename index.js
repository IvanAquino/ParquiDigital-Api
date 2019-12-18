const http = require('http');
const { ApolloServer, PubSub } = require('apollo-server-express');
const express = require('express');

const config = require('./config')
const schema = require("./api")
const jwt = require('jsonwebtoken')

const app = express();
const pubsub = new PubSub()
pubsub.ee.setMaxListeners(50)

const server = new ApolloServer({
    schema,
    playground: config.debug,
    cors: config.cors,
    context: ({ req, connection }) => {
      if (!! connection ) return {...connection.context, pubsub}
      if (!!req) {
          const token = req.headers['authorization'];
          if (!!token) {
              try {
                  let verifiedData = jwt.verify(token, config.jwt.secret);
                  return { authenticatedId: verifiedData.user, authenticatedType: verifiedData.type, pubsub }
              } catch (err) {
                  return {}
              }
          }
      }
  },
  subscriptions: {
      onConnect: async (connectionParams) => {
          let verifiedData = jwt.verify(connectionParams.authorization, config.jwt.secret)
          return { authenticatedId: verifiedData.user, authenticatedType: verifiedData.type }
      }
  }
});

app.get('/', function (req, res) {
    res.send('Hola :) !')
})

server.applyMiddleware({app})

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(config.port, () => {
  console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${config.port}${server.subscriptionsPath}`)
})