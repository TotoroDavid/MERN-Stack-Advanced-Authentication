/**
 * middleware to protect the private route
 */
const jwt = require('jsonwebtoken')
/** models schema mongoose */
const User = require('../models/Users')
/** handler error middleware */
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        //bearer +token
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ErrorResponse('Not authorization to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if (!user) {
            return next(new ErrorResponse('Not user found with this Id', 404))
        }

        req.user = user

        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorization to access this route', 404))
    }
}