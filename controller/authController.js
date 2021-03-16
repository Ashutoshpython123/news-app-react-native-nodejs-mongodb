const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authController = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')
            const user_name = await Users.findOne({ username: newUserName })

            if (user_name) {
                return res.status(400).json({ msg: "this user is already exist" })
            }

            const user_email = await Users.findOne({ email })
            if (user_email) {
                return res.status(400).json({ msg: "this email is already exist" })
            }

            if (password.length < 6) {
                return res.status(400).json({ msg: "password should be atleast 6 character" })
            }

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname, username: newUserName, email, password: passwordHash, gender
            })

            const access_token = createAccessToken({ id: newUser._id })
            const refresh_token = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: 'api/refresh_token',
                maxAge: 60 * 60 * 60 * 24
            })

            await newUser.save()

            res.json({
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
                .populate('followers following', "-password")
            if (!user) {
                return res.status(400).json({ msg: "this email is not exist" })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ msg: "this password is incorrect" })
            }

            const access_token = createAccessToken({ id: user._id })
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: 'api/refresh_token',
                maxAge: 60 * 60 * 60 * 24
            })

            res.json({
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {
                path: 'api/refresh_token'
            })

            return res.json({ msg: "logout successfully" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) {
                return res.status(400).json({ msg: "please login first" })
            }
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err) {
                    return res.status(400).json({ msg: "please login first" })
                }

                const user = await Users.findById(result.id).select("-password")
                    .populate('followers following', "-password")

                if (!user) {
                    return res.status(400).json({ msg: "user does not exist" })
                }

                const access_token = createAccessToken({ id: result.id })
                res.json({
                    access_token,
                    user
                })
                return res.json({access_token})
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = authController;