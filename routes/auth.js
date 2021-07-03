const express = require('express')
const router = express.Router()

//controller
const {
    register,
    login,
    forgotpassport,
    resetpassword
} = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgotpassport').post(forgotpassport)
router.route('/resetpassword/:resetToken').put(resetpassword)



module.exports = router