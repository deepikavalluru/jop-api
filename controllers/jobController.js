const Job = require("../models/Job");

const getJobs  =async (req, res) => {
    try {
        const {role, location} = req.query;
        let query = {};

        if (role) {
            query.title = { $regex: role, $options: "i" };
        }

        if (location) {
            query.location = { $regex: location, $options: "i"};
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = { getJobs };