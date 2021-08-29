/**
 * 
 * the controllers for our routes
 * 
 */

const crypto = require('crypto')
/** models */
const User = require('../models/Users')
/** class handler error middleware */
const ErrorResponse = require('../utils/errorResponse')
/** send Email */
const sendEmail = require('../utils/sendEmail')

/** 
 * register the user 
 */
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

/** 
 * login 
 */
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

/** 
 * forgot the password 
 */
exports.forgotPassword = async (req, res, next) => {
    /** Send Email to email provided but first check if user exists */
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return next(new ErrorResponse('Email does not exist', 404))
        }

        /** Reset Token Gen and add to database hashed (private) version of token */
        const resetToken = user.getResetPasswordToken()

        await user.save()

        /** create reset url to email to provide the email  */
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`
        /** HTML message */
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off >${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: message
            })

            res.status(200).json({ success: true, data: 'Email sent' })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next(new ErrorResponse('Email could not be send', 500))
        }
    } catch (error) {
        next(error)
    }
}

/**
 * reset token
 */
exports.resetPassword = async (req, res, next) => {
    /** compare token in url params to hashed token */
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Updated Success",
        })
    } catch (error) {
        next(error)
    }
}

/** json webToken */
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}