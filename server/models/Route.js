const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    
    ProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    path:      { type: String, required: true }, // e.g., "/login", "/users/:id"

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
    of: String, // Simplified for now (can be expanded to full JSON schema)
    default: {}
    },

    mockData: { type: mongoose.Schema.Types.Mixed }, // Optional manual or generated mock entries

    createdAt: { type: Date, default: Date.now }
})

models.export = mongoose.model('Route', routeSchema)