/**
 * the controllers for our routes
 */

//models
const User = require('../models/Users')

/** register the user */
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        /** create an use */
        const user = await User.create({
            username, email, password
        })

        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

/** login */
exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            success: false, error: 'please provide email and password'
        })
    }

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            res.status(400).json({ success: false, error: 'invalid credentials' })
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            res.status(404).json({ success: false, error: 'Invalid credentials' })
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