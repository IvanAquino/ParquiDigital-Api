const mongoose = require('mongoose')
const config = require('../config')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(config.mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true })

const polygonSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]],
        required: true
    }
}, { _id: false })

const pointSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false })

const clientSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    credit: { type: mongoose.Number, default: 200 }
})
const ClientModel = mongoose.model('Client', clientSchema)

const parkingFeeSchema = mongoose.Schema({
    name: { type: String, required: true},
    area: { type: polygonSchema, required: true },
    perHour: { type: mongoose.Number, required: true }
})
const ParkingFeeModel = mongoose.model('ParkingFee', parkingFeeSchema)

const parkedCarSchema = mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Client'},
    parkingFee: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ParkingFee'},
    licensePlate: { type: String, required: true },
    time: { type: Number, required: true },
    total: { type: Number, required: true },
    finishAt: { type: Date, required: true },
    location: {type: pointSchema, required: true }
}, {
    timestamps: true
})
parkedCarSchema.index({ location: '2dsphere' })
const ParkedCarModel = mongoose.model('ParkedCar', parkedCarSchema)

const userSchema = mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, unique: true },
    password: { type: String, required: true},
})
const UserModel = mongoose.model('User', userSchema)

module.exports = {
    ClientModel,
    ParkedCarModel,
    ParkingFeeModel,
    UserModel
}