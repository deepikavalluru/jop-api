const User = require("./models/User");
const Job = require("./models/Job");

const cleardb = async () => {
    try {
        await User.deleteMany({});
        await Job.deleteMany({});

        const userCount = await User.countDocuments();
        const jobCount = await Job.countDocuments();

        console.log("DB cleared!!");
        console.log("Users:", userCount);
        console.log("Jobs:", jobCount);

    } catch (err) {
        console.error("Error clearing DB:", err.message);
    }
};

module.exports = cleardb;