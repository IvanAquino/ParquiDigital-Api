const moment = require("moment")
const { ParkedCarModel, ClientModel, ParkingFeeModel } = require('../../db')

// MUTATION
const createParkedCar = async (_, { input }, { authenticatedId, authenticatedType, pubsub }) => {
    if ( authenticatedType != "client" ) throw new Error("Access denied")
    let parkingFee = await ParkingFeeModel.findOne({ _id: input.parkingFeeId })
    if ( !parkingFee ) throw new Error("Parking Fee not found")

    let finishAt = moment().add(input.time, 'minutes')
    let total = (parseFloat(parkingFee.perHour) / 60) * input.time
    
    let parkedCar = ParkedCarModel({
        licensePlate: input.licensePlate,
        finishAt: finishAt.toDate(),
        client: authenticatedId,
        parkingFee: parkingFee._id,
        time: input.time,
        total: total,
        location: {
            type: 'Point',
            coordinates: input.coordinates
        }
    })

    await parkedCar.save()

    await parkedCar.populate('client')
                    .populate('parkingFee')

    pubsub.publish("PARKED_CAR", {createdParkedCar: parkedCar})

    return parkedCar
}

// QUERY
const myActiveParkedCar = async (_,__, { authenticatedId, authenticatedType }) => {
    if ( authenticatedType != "client" ) throw new Error("Access denied")

    let activeParkedCar = await ParkedCarModel.findOne({ finishAt: {$gte: new Date() }, client: authenticatedId })
                                .populate('client')
                                .populate('parkingFee')

    return activeParkedCar
}

// QUERY
const activeParkedCars = async (_,__, { authenticatedId, authenticatedType }) => {
    if ( authenticatedType != "user" ) throw new Error("Access denied")

    let parkedCars = await ParkedCarModel.find({ finishAt: {$gte: new Date() } })
                                .populate('client')
                                .populate('parkingFee')
    
    return parkedCars
}

// QUERY
const myParkedCars = async (_, __, { authenticatedId, authenticatedType}) => {
    if ( authenticatedType != "client" ) throw new Error("Access denied")
    const parkedCars = await ParkedCarModel.find({ client: authenticatedId })
                            .populate('client')
                            .populate('parkingFee')

    return parkedCars
}

// SUBSCRIPTION
const createdParkedCar = {
    subscribe: async (_,__, { authenticatedId, authenticatedType, pubsub }) => {
        if ( authenticatedType != "user" ) throw new Error("Subscription denied")

        return pubsub.asyncIterator(["PARKED_CAR"])
    }
}

module.exports = {
    Query: {
        activeParkedCars,
        myActiveParkedCar,
        myParkedCars
    },
    Mutation: {
        createParkedCar
    },
    Subscription: {
        createdParkedCar
    }
}