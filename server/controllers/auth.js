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

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}

/** login */
exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return
        next(new ErrorResponse('please provide an Email and Password', 400))
    }

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        res.status(200).json({
            success: true,
            token: 'sakdpsd'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.forgotPassword = (req, res, next) => {
    res.send('forgotPassword route')
}

exports.resetPassword = (req, res, next) => {
    res.send('resetPassword route')
}