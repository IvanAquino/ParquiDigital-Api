const { ParkingFeeModel } = require('../../db')

// MUTATION
const createParkingFee = async (_, { input }, { authenticatedId, authenticatedType }) => {
    if ( authenticatedType != "user" ) throw new Error("Access denied")

    const parkingFee = ParkingFeeModel({
        area: input.area,
        name: input.name,
        perHour: input.perHour
    })

    await parkingFee.save()

    return parkingFee
}

// MUTATION
const deleteParkingFee = async (_, { input }, { authenticatedId, authenticatedType }) => {
    if ( authenticatedType != "user" ) throw new Error("Access denied")

    const parkingFee = await ParkingFeeModel.findOne({ _id: input.parkingFeeId })
    await parkingFee.remove()

    return "Tarifa eliminada correctamente"
}

// QUERY
const nearParkingFees = async (_, { input }, { authenticatedId, authenticatedType }) => {
    if ( authenticatedType != "client" ) throw new Error("Access denied")

    const parkingFees = await ParkingFeeModel.find({
        area: {
            $geoIntersects: {
                $geometry: input.screenBounds
            }
        }
    })

    return parkingFees
}

// QUERY - Note: Needs pagination
const parkingFees = async (_, __, { authenticatedType }) => {
    if (authenticatedType != "user") throw new Error("Access denied")

    const parkingFees = await ParkingFeeModel.find({})

    return parkingFees
}

module.exports = {
    Mutation: {
        createParkingFee,
        deleteParkingFee
    },
    Query: {
        nearParkingFees,
        parkingFees
    }
}