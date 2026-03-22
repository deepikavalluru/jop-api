const {chromium} = require("playwright");
const Job = require("../models/Job");

const scrapeRemoteOk = async () => {
    try {
        console.log("Scraper started");

        const browser = await chromium.launch({
            args: ["--no-sandbox"]
        });

        const page = await browser.newPage();

        await page.goto("https://remoteok.com/remote-dev-jobs");

        const jobs = await page.evaluate(() => {
            const rows = document.querySelectorAll("tr.job");

            return Array.from(rows).map(job => {
                const title = job.querySelector("h2")?.innerText;
                const company = job.querySelector(".companyLink h3")?.innerText;
                const location = job.querySelector(".location")?.innerText || "Remote";
                const href = job.getAttribute("data-href");

                if (!title || !company || !href) return null;

                const applyLink = "https://remoteok.com" + href;

                return { title, company, location, applyLink };
            })
            .filter(Boolean);
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
    } catch(err) {
        console.error("Scraper ERROR: ", err.message);
    }
};

module.exports = scrapeRemoteOk;