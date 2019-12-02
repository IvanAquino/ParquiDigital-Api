const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const config = require('./config')
const schema = require("./api")

const app = express();
const server = new ApolloServer({
    schema,
    playground: config.debug
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