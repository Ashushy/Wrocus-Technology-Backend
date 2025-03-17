const userModel = require('../models/userAuthModel')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');


exports.userRegistration = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body
    console.log(req.body)

    if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }
    if (password !== confirmpassword) {
        return res.status(400).json({
            message: "passwords do not match"
        })
    }
    try {
        const existingUser = await userModel.findOne({ email })
        console.log(existingUser)
        if (existingUser) {
            return res.status(401).json({
                message: "email already exist"
            })
        }
        const hashPassword = CryptoJS.AES.encrypt(password, 'wrocus123').toString();

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword


        })
        await newUser.save()
        return res.status(201).json({
            success: true,
            message: "User Registered successfully",
            newUser: {
                name: newUser.name,
                email: newUser.email,
                id: newUser._id
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        })
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    try {
        const user = await userModel.findOne({ email: email })
        console.log(user)
        if (!user) {
            return res.status(404).json({
                message: "Invalid credential"
            })
        }

        const bytes = CryptoJS.AES.decrypt(user.password, 'wrocus123');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText !== password) {
            return res.status(400).json({
                message: "Invalid credential"
            })

        }

        // generate a JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin,  name: user.name, },
            'wrocus1234',
            { expiresIn: '10d' }

        )

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            userInfo: {
                email: user.email,
                name: user.name,
                id: user._id,
                token: token,
                role:user.isAdmin
            }
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message || "Internal server error"
        })

    }

}
