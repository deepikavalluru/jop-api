const axios = require("axios");
const Job = require("../models/Job");

const scrapeArbeitnow = async () => {
    try {
        console.log("Arbeitnow scraper started");

        const { data } = await axios.get("https://arbeitnow.com/api/job-board-api");

        const jobs = data.data || [];

        console.log("Jobs fetched: ", jobs.length);

        const bulkOps = jobs.map(job => {
            if (!job.url || !job.title) return null;

            return {
                updateOne: {
                    filter: { applyLink: job.url },
                    update: {
                        title: job.title || "No Title",
                        company: job.company_name || "Unknown",
                        location: job.location || "Remote",
                        applyLink: job.url,
                        skills: job.tags || [],
                        source: "arbeitnow"
                    },
                    upsert: true
                }
            };
        }).filter(Boolean);

        if(bulkOps.length > 0) {
            try {
                await Job.bulkWrite(bulkOps);
            }catch(err) {
                if(err.code === 11000) {
                    console.log("Duplicate entries skipped");
                }
                else {
                    console.log(err.message);
                }
            }
        }

        console.log("Arbeitnow jobs saved");
    }catch(err) {
        console.error("Arbritnow scraer error: ", err.message);
    } 
};

module.exports = scrapeArbeitnow;