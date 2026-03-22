const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

const scrapeRemoteOk = async () => {
    try {
        console.log("Scraper started");

        const { data } = await axios.get("https://remoteok.com/remote-dev-jobs", {
            headers: {
                "User-Agent": "...",
                "Referer": "https://google.com",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        const $ = cheerio.load(data);
        const jobs = [];

        $("tr.job").each((i, el) => {
            const title = $(el).find("h2").text();
            const company = $(el).find(".companyLink h3").text();
            const location = $(el).find(".location").text() || "Remote";
            const href = $(el).attr("data-href");

            if (!title || !company || !href) return;
            jobs.push({
                title,
                company,
                location,
                applyLink: "https://remoteok.com" + href
            });
        });

        console.log("Jobs fetched : ", jobs.length);

        for (let job of jobs) {
            try {
                await Job.updateOne(
                    { applyLink: job.applyLink },
                    {
                        ...job,
                        skills: [],
                        source: "remoteok"
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log("Error saving job:", err.message);
            }
        }

        console.log("Jobs saved; Scraping Done!!");
        await browser.close();
    } catch (err) {
        console.error("Scraper ERROR: ", err.message);
    }
};

module.exports = scrapeRemoteOk;