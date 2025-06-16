const mongoose = require('mongoose')

const mockDataSchema = mongoose.Schema({
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    index: Number, //pagination
    data: [mongoose.Schema.Types.Mixed]
})


module.exports = mongoose.model('MockData', mockDataSchema)