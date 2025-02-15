const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors()); // Allows requests from frontend
app.use(express.json()); // Parses JSON requests

app.get("/api/data", (req, res) => {
  res.json({ success: true, message: "GET request successful!" });
});

app.post("/api/data", async (req, res) => {
  const platform = req.body.id;
  const id = req.body.message;
  if (platform === 'Leetcode') { 
    try {
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${id}`);
      res.json(response.data);
      console.log(response.data);
      if (!response.data.success) {
        console.log(response.data.message);
      }
    } catch {
      console.log("Error: Failed to Fetch");
    }
  }
  if (platform === 'Codechef') {
    try {
      const response = await axios.get(`https://codechef-api.vercel.app/${id}`);
      res.json(response.data);
      console.log(response.data);
      if (!response.data.success) {
        console.log("User does not exist");
      }
    } catch {
      console.log("Error: Failed to Fetch");
    }
  }
  if (platform === 'CodeForces'){
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${id}`);
      res.json(response.data);
      console.log(response.data);
      if (response.data.status !== 'OK') {
        console.log("Invalid user id");
      }
    } catch {
      console.log("Error: Failed to Fetch");
      res.json("User does not exist");
    }
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));