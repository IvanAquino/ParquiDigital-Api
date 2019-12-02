const mongoose = require('mongoose')
const config = require('../config')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(config.mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true })

const clientSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
})
const ClientModel = mongoose.model('Client', clientSchema)

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
})
const UserModel = mongoose.model('User', userSchema)

module.exports = {
    ClientModel,
    UserModel
}