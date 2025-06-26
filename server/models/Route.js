const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    
    ProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    path:      { type: String, required: true }, 

    methods:   [{ type: String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }],

    logic: {
     type: String 
    },

    schema: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, 
    default: {}
    },


}, { timestamps: true })

module.exports = mongoose.model('Route', routeSchema)