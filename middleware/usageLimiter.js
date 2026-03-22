const User = require("../models/User");

const usageLimiter = async (req, res, next) => {
    try {
        const user = req.user;

        const today = new Date().toDateString();
        const lastDate = new Date(user.lastRequestDate).toDateString();

        if(today !== lastDate) {
            user.requestCount = 0;
            user.lastRequestDate = new Date();
        }

        if(user.requestCount >= 100) {
            return res.status(429).json({error: "Daily limit reached"});
        }

        user.requestCount += 1;
        await user.save();
        next();
    }catch(err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = usageLimiter;