const clientType = "client"
const userType = "user"

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../../config")

const { UserModel, ClientModel } = require("../../db")

/**
 * Generate json web token and extract expires time
 * @param {String} user 
 * @param {String} type 
 * @param {String} expiresIn 
 */
const generateToken = (user, type, expiresIn) => {
    const token = jwt.sign({ user, type }, config.jwt.secret, { expiresIn })
    const tokenData = jwt.verify(token, config.jwt.secret)
    return {
        token,
        expiresIn: tokenData.exp
    }
}

const authenticate = async (_, { input }, ctx) => {
    const { type, username, password } = input

    if ( type == clientType ) return await authenticateWithClient(username, password)
    if ( type == userType   ) return await authenticateWithUser(username, password)
}

const authenticateWithClient = async (email, password) => {
    const client = await ClientModel.findOne({ email })
    if ( !client ) throw new Error("Client not found")

    const isPasswordCorrect = bcrypt.compareSync(password, client.password)
    if ( !isPasswordCorrect ) throw new Error("Verify your credentials")
    
    return generateToken(client._id, clientType, '365d')
}

const authenticateWithUser = async (email, password) => {
    const user = await UserModel.findOne({ email })
    if ( !user ) throw new Error("User not found")
    
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if ( !isPasswordCorrect ) throw new Error("Verify your credentials")

    return generateToken(user._id, userType, '365d')
}

module.exports = {
    Mutation: {
        authenticate
    }
}