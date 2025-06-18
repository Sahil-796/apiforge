const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    
    ProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    path:      { type: String, required: true }, 

    methods:   [{ type: String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }],

    logic: {
    GET:    { type: String }, // Stored as JS code string
    POST:   { type: String },
    PUT:    { type: String },
    PATCH:  { type: String },
    DELETE: { type: String }
    },

    schema: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, 
    default: {}
    },

    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Route', routeSchema)