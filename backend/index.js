const express = require("express");
const cors = require("cors");
const axios = require("axios");
// const { model } = require("mongoose");

const app = express();
app.use(cors(
    // {
    //     origin: ["https://codex-track-3fo99kvdc-sharath-chandras-projects-df63d9ae.vercel.app"],
    //     methods: ["POST", "GET"],
    //     credentials: true
    // }
));

app.use(express.json());

// API Test Route
app.get("/", (req, res) => {
    res.json({ success: true, message: "API is running successfully!" });
});

// API Data Fetch Route
app.post("/api/data", async (req, res) => {
    const platform = req.body.id;
    const id = req.body.message;

    try {
        let response;
        if (platform === 'Leetcode') {
            response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${id}`);
        } else if (platform === 'Codechef') {
            response = await axios.get(`https://codechef-api.vercel.app/${id}`);
        } else if (platform === 'CodeForces') {
            response = await axios.get(`https://codeforces.com/api/user.info?handles=${id}`);
        } else {
            return res.status(400).json({ error: "Invalid platform" });
        }
        res.json(response.data);
    } catch (error) {
        console.error("Error: Failed to Fetch", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Export for Vercel
app.listen(5000, () => console.log("Server running at port 5000"));

module.exports = app;
