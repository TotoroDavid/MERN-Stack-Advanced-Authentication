/**
 * the controllers for our routes
 */

/** models */
const User = require('../models/Users')
/** class handler error middleware */
const ErrorResponse = require('../utils/errorResponse')

/** register the user */
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        /** create an user */
        const user = await User.create({
            username, email, password
        })

        sendToken(user, 201, res)
    } catch (error) {
        next(error)
    }
}

/** login */
exports.login = async (req, res, next) => {
    const { email, password } = req.body

    /** Check if email and password is provided */
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    try {
        /** Check that user exists by email */
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        /** Check that password match */
        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        sendToken(user, 200, res)

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

/** forgot the password */
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body

    try {
        const user = User.findOne({ email })

        if (!user) {
            return next(new ErrorResponse('Email does not exist', 404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()
    } catch (error) {

    }
}

exports.resetPassword = (req, res, next) => {
    res.send('resetPassword route')
}

/** json webToken */
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}