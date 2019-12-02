const { UserModel } = require("../../db")
const hashPassword = require("../../helpers/hashPassword")

const createUser = async (_, { input }, ctx) => {
    const hashedPassword = hashPassword(input.password)
    
    const user = UserModel({
        name: input.name,
        email: input.email,
        password: hashedPassword
    })

    await user.save()

    return user
}

module.exports = {
    Query: {
        user: (_, args, ctx) => {
            return {name: 'ivn', email: 'asd@'}
        }
    },
    Mutation: {
        createUser
    }
}