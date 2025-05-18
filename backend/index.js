const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ success: true, message: "API is running successfully!" });
});

app.post("/api/data", async (req, res) => {
    const platform = req.body.id;
    const id = req.body.message;
    // res.json(platform);  
    

    try {
        let response;

        if (platform === 'Leetcode') {
            response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${id}`);
            res.json(response.data);
        } else if (platform === 'Codechef') {
            response = await axios.get(`https://codechef-api.vercel.app/${id}`);
            res.json(response.data);
        } else if (platform === 'CodeForces') {
            response = await axios.get(`https://codeforces.com/api/user.info?handles=${id}`);
            res.json(response.data);
        } else if (platform === 'GeeksforGeeks') {
            const url = `https://auth.geeksforgeeks.org/user/${id}/`;
            
            
            const { data } = await axios.get(url);

            const $ = cheerio.load(data);

            const scrapedData = {};

            scrapedData["Username"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_left__YzUgU > div.profilePicSection_head__hgpPs > div.profilePicSection_head_userHandle__oOfFy').text();
            scrapedData["Institute"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.educationDetails_head__eNlYv > div.educationDetails_head_left__NkHF5 > a').text();
            scrapedData["Institute Rank"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.educationDetails_head__eNlYv > div.educationDetails_head_left__NkHF5 > div.educationDetails_head_left_userRankContainer__tyT6H > div > a > span > b').text();
            scrapedData["Coding Score"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(1) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x').text();
            scrapedData["Problems Solved"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(3) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x').text();
            scrapedData["Contest Rating"] = $('div.AuthLayout_outer_div__20rxz > div > div.AuthLayout_head_content__ql3r2 > div > div > div._userName__head_userDetailsSection_section1__2fMAG > div > div.userDetails_head_right__YQBLH > div > div.scoreCards_head__G_uNQ > div:nth-child(5) > div:nth-child(1) > div.scoreCard_head_left--score__oSi_x').text();

            // console.log(scrapedData);
            
            res.json(scrapedData);
        } else if (platform === 'spoj') {

            const url = `https://www.spoj.com/users/${id}/`;
            
            
            const { data } = await axios.get(url);

            const $ = cheerio.load(data);

            const scrapedData = {};


            scrapedData["User Id"] = id;
            scrapedData["Global Rank"] = $('p:nth-child(6)').text();
            scrapedData["Problems Solved"] = $('div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div > div.row > div.col-md-6.text-center.valign-center > dl > dd:nth-child(2)').text();
            scrapedData["Submissions"] = $('div:nth-child(2) > div > div.col-md-9 > div:nth-child(2) > div > div.row > div.col-md-6.text-center.valign-center > dl > dd:nth-child(4)').text();

            res.json(scrapedData);

        } else if (platform === 'atcoder') {
            const url = `https://atcoder.jp/users/${id}`;
            
            
            const { data } = await axios.get(url);

            const $ = cheerio.load(data);

            const scrapedData = {};


            scrapedData["Global Rank"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(1) > td').text();
            scrapedData["Rated Matches"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(4) > td').text()
            scrapedData["Current Rating"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(2) > td > span').text();
            scrapedData["Highest Rating"] = $('div.row > div.col-md-9.col-sm-12 > table > tbody > tr:nth-child(3) > td > span.user-red').text();

            res.json(scrapedData);
        } else {
            res.status(400).json({ error: "Invalid platform" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(5000, () => console.log("Server running at port 5000"));

module.exports = app;
