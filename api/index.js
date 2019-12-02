const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('graphql-tools')

const resolvers = require('./resolvers')

const authenticateSchema = importSchema(__dirname + "/authenticate/authenticate.graphql")
const clientSchema = importSchema(__dirname + "/client/client.graphql")
const userSchema = importSchema(__dirname + "/user/user.graphql")

const typeDefs = importSchema(
    __dirname + "/schema.graphql", {
        authenticateSchema,
        clientSchema,
        userSchema
    }
);

module.exports = makeExecutableSchema({ typeDefs, resolvers })