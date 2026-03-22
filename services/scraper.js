const puppeteer = require("puppeteer");
const Job = require("../models/Job");

const scrapeRemoteOk = async () => {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://remoteOk.com/remote-dev-jobs", {
        waitUntil: "networkidle2"
    });

    const jobs = await page.evaluate(() => {
        const rows = document.querySelectorAll("tr.job");

        return Array.from(rows).map(job => {
            const title = job.querySelector("h2")?.innerText;
            const company = job.querySelector(".companyLink h3")?.innerText;
            const location = job.querySelector(".location")?.innerText || "Remote";
            const href = job.getAttribute("data-href");

            if(!title || !company || !href) return null;

            const applyLink = "https://remoteok.com" + job.getAttribute("data-href");

            return {title, company, location, applyLink};
        });
    });

    for(let job of jobs) {
        try {
            await Job.updateOne(
                {applyLink: job.applyLink},
                {
                    ...job,
                    skills: [],
                    source: "remoteok"
                },
                {upsert: true}
            );
        }catch(err) {
            console.log("Error saving job:", err.message);
        }
    }

    await browser.close();
    console.log("Scraping Done");
};

module.exports = scrapeRemoteOk;