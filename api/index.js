const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')

const resolvers = require('./resolvers')
const typeDefs = importSchema(__dirname + "/schema.graphql");

module.exports = makeExecutableSchema({ typeDefs, resolvers })