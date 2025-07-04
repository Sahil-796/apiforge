const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function (){
            return !this.googleId
        }
    },
    googleId: {
        type: String,
        default: null
    },
    

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)