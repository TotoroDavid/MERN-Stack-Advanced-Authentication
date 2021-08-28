/**
 * private route
 */
const express = require('express')
const router = express.Router()
/** private controller */
const { getPrivateData } = require('../controllers/private.js')
/** middleware to protect the private route */
const { protect } = require('../middleware/auth')

/** http://localhost:5000/api/private */
router.route('/').get(protect, getPrivateData)

module.exports = router