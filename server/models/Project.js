const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    name: { type: String, required: true }, // e.g., "User Management"

    slug: { type: String, required: true }, // e.g., "users" → used in the URL

    description: { type: String },

    apiKey: { type: String, unique: true, index: true },


}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)