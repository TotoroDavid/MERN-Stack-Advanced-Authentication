/**
 * mongoose schema
 */
const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

/** jsonwebtoken */
UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

/** reset jsonwebtoken */
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordToken = Date.now() + 10 * (60 * 1000)

    return resetToken
}

const User = mongoose.model('User', UserSchema)

module.exports = User

/**
 * pre function inSchema Pre middleware functions are executed one after another, when each middleware calls next.
 */