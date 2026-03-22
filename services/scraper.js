const axios = require("axios");
const Job = require("../models/Job");

const scrapeRemoteOk = async () => {
    try {
        console.log("Scraper started");

        const { data } = await axios.get("https://remoteok.com/remote-dev-jobs");

        const jobs = data.jobs;

        console.log("Jobs fetched : ", jobs.length);

        for (let job of jobs) {
            try {
                await Job.updateOne(
                    { applyLink: job.url },
                    {
                        title: job.title,
                        compsny: job.company_name,
                        location: job.candidate_required_location || "Remote",
                        applyLink: job.url,
                        skills: jobs.tag || [],
                        source: "remotive"
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log("Error saving job:", err.message);
            }
        }

        console.log("Jobs saved; Scraping Done!!");
    } catch (err) {
        console.error("Scraper ERROR: ", err.message);
    }
};

module.exports = scrapeRemoteOk;