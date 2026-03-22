const User = require("../models/User");

const apiKeyAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if(!apiKey) {
            return res.status(401).json({error : "API key required!!"});
        }

        const user = await User.findOne({apiKey});

        if(!user) {
            return res.status(403).json({error: "Invalid API Key!!"});
        }

        req.user = user;
        next();
    }catch(err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = apiKeyAuth;