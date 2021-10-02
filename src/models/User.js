const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const userSchema  = {
    email: {
        type: String, 
        required: true,
        trim: true, 
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
    
}

const User = mongoose.model('User', userSchema)

module.exports = User