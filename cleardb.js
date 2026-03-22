const User = require("./models/User");
const Job = require("./models/Job");

const cleardb = async (req, res) => {
    try {
        await User.deleteMany({});
        await Job.deleteMany({});
        console.log("DB cleared!!");
    }catch(err) {
        res.json({error: err.message})
    }
};

module.exports = cleardb;