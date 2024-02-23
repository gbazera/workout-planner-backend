const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const VerificationToken = require('../models/verificationTokenModel')
const nodemailer = require('nodemailer')
const { json } = require('express')

const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const createVerificationToken = (email)=>{
    return jwt.sign({email}, process.env.SECRET, {expiresIn: '30m'})

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
        const verificationToken = createVerificationToken(user.email)

        await VerificationToken.create({
            user_id: user._id,
            token: verificationToken
        })

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verify your account',
            text: 'Click here to verify your Workout Planner account: http://localhost:3000/verify/' + verificationToken
        }
    
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
            
                res.status(500).json({ error: 'Failed to send verification email.' });
              } else {
                console.log('Email sent:', info.response);
            
                res.status(200).json({ message: 'Verification email sent.' });
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
        const decoded = jwt.verify(token, process.env.SECRET)
        const user = await User.findById({ email: decoded.email })
        const verificationToken = await VerificationToken.findOne({ user_id: user._id})

        if(!user || !verificationToken || verificationToken.token !== token){
            throw new Error('Invalid or expired verification token.')
        }

        user.verified = true
        await user.save()
        await verificationToken.delete()

        res.status(200).json({ message: 'Your account has been verified.' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = { loginUser, signupUser, verifyUser }
