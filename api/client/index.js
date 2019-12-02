const { ClientModel } = require("../../db")
const hashPassword = require("../../helpers/hashPassword")

const createClient = async (_, { input }, ctx) => {
    console.log(input)
    const hashedPassword = hashPassword(input.password)

    const client = ClientModel({
        name: input.name,
        email: input.email,
        password: hashedPassword
    })

    await client.save()

    return client
}

module.exports = {
    Query: {},
    Mutation: {
        createClient
    }
}