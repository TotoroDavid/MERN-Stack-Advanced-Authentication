/**
 * mongoose schema
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide the username']
    },
    email: {
        type: String,
        required: [true, 'Please provide the email address'],
        unique: true,
        /** validate an email address */
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide the password'],
        minLength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

/** middleware for encrypt our password */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

/** match the password */
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User

/**
 * pre function inSchema Pre middleware functions are executed one after another, when each middleware calls next.
 */