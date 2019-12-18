const { GraphQLScalarType } = require('graphql')

const dateResolver = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
        return new Date(value); // value from the client
    },
    serialize(value) {
        return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(ast.value) // ast value is always in string format
        }
        return null;
    },
})

const authenticateResolvers = require('./authenticate')
const clientResolvers = require('./client')
const parkedCarResolvers = require('./parkedCar')
const parkingFeeResolvers = require('./parkingfee')
const userResolvers = require('./user')

module.exports = {
    Query: {
        ...parkedCarResolvers.Query,
        ...parkingFeeResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...authenticateResolvers.Mutation,
        ...clientResolvers.Mutation,
        ...parkingFeeResolvers.Mutation,
        ...parkedCarResolvers.Mutation,
        ...userResolvers.Mutation,
    },
    Subscription: {
        ...parkedCarResolvers.Subscription
    },
    Date: dateResolver
}