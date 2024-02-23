const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')

const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)

        res.status(200).json({ email, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const signupUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.signup(email, password)
        const token = createToken(user._id)
        
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')

        user.verificationToken = hashedVerificationToken
        await user.save()

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: 'Click here to verify your Workout Planner account: http://localhost:3000/verify?token=' + verificationToken
        }
    
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
              } else {
                console.log('Email sent:', info.response);
              }
        });

        res.status(200).json({ email, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const verifyUser = async (req, res) => {
    const token = req.params.token

    try{
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({ verificationToken: hashedToken })

        if (!user) {
            throw Error('Invalid token.')
        }

        user.verified = true
        user.verificationToken = undefined
        await user.save()

        res.status(200).json({ message: 'Your account has been verified.' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = { loginUser, signupUser, verifyUser }
