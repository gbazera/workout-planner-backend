const express = require('express')

const { loginUser, signupUser, verifyUser } = require('../controllers/userController')

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.get('/verify/:token', verifyUser)

module.exports = router
