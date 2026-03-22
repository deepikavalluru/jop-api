const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signup = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error: "Email and password are required!!"});
        }

        const emailRegex = /^[^s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email format!"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({error: "User already exists!!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const apiKey = crypto.randomBytes(20).toString("hex");

        const user = await User.create({
            email,
            password: hashedPassword,
            apiKey
        });

        res.json({
            message: "User created",
            apiKey
        });
    }catch(err) {
        res.status(500).json({error: err.message});
    }
}

const login =async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error: "Email and password are required!!"});
        }

        const emailRegex = /^[^s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email format!"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({error: "User not found!!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({error: "Invalid credentials!!"});

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({token});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {signup, login};