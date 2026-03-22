const userRequestMap = new Map(); // userId => [timestamps]

const usageLimiter = async (req, res, next) => {
    try {
        const user = req.user;

        const now = Date.now();
        const userId = user._id.toString();

        // Initialize
        if (!userRequestMap.has(userId)) {
            userRequestMap.set(userId, []);
        }

        let timestamps = userRequestMap.get(userId);

        // Keep only last 60 seconds
        timestamps = timestamps.filter(ts => now - ts < 60 * 1000);

        if (timestamps.length >= 10) {
            return res.status(429).json({ error: "Too many requests per minute" });
        }

        // Add current request
        timestamps.push(now);
        userRequestMap.set(userId, timestamps);

        // Daily limit (still in DB)
        const today = new Date().toDateString();
        const lastDate = new Date(user.lastRequestDate).toDateString();

        if (today !== lastDate) {
            user.requestCount = 0;
            user.lastRequestDate = new Date();
        }

        if (user.requestCount >= 100) {
            return res.status(429).json({ error: "Daily limit reached" });
        }

        user.requestCount += 1;
        await user.save();

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = usageLimiter;