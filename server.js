const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require("./routes/authRoutes");
const cron = require("node-cron");
const scrapeRemoteOk = require("./services/scraper");
const cleardb = require('./cleardb');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
//cleardb(); 
scrapeRemoteOk();
cron.schedule("0 */4 * * *", () => {
    console.log("Running scraper!!...");
    scrapeRemoteOk();
});

app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("API Running!!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listenng on ${PORT}`);
});