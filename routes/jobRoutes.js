const express = require('express');
const Job = require('../models/Job');
const router = express.Router();
const {getJobs} = require("../controllers/jobController");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const usageLimiter = require('../middleware/usageLimiter');

router.post('/add', async (req, res) => {
    try {
        const job = new Job({
            title: "Frontend Developer",
            company: "Test Company",
            loation: "India",
            applyLink: "https://example.com/job1",
            skills: ["React", "JavaScript"],
            source: "manual"
        });

        const savedJob = await job.save();
        res.json(savedJob);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/", apiKeyAuth, usageLimiter, getJobs);

module.exports = router;