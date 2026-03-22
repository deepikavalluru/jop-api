const axios = require("axios");
const Job = require("../models/Job");

const scrapeRemotive = async () => {
    try {
        console.log("Remotive scraper started");

        const { data } = await axios.get("https://remotive.com/api/remote-jobs");

        const jobs = data.jobs || [];

        console.log("Jobs fetched : ", jobs.length);

        const bulkOps = jobs.map(job => {
            if(!job.url || !job.title) return null;

            return {
                updateOne: {
                    filter: {applyLink: job.url},
                    update: {
                        title: job.title || "No Title",
                        company: job.company_name || "unknown",
                        location: job.candidate_required_location || "Remote",
                        applyLink: job.url,
                        skills: job.tags || [],
                        source: "remotive"
                    },
                    upset: true
                }
            };
        }).filter(Boolean)

        if(bulkOps.length > 0) {
            try {
                await Job.bulkWrite(bulkOps);
            }catch(err) {
                if(err.code === 11000) {
                    console.log("Duplicate entries skipped");
                }else {
                    console.error(err.message);
                }
            }
        }

        console.log("Remotive Jobs saved. Scraping Done!!");
    } catch (err) {
        console.error("Remotive scraper ERROR: ", err.message);
    }
};

module.exports = scrapeRemotive;