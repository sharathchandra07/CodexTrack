const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
// const chromium = require("chrome-aws-lambda");

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
        } else if (platform === 'interviewbit') {
           const scrapedData = {};

            try {
                const browser = await puppeteer.launch({ headless: "new" });
                const page = await browser.newPage();
                await page.goto(`https://www.interviewbit.com/profile/${id}/`);


                const notFound = await page.evaluate(() => {
                    return document.body.innerText.includes("404") || document.body.innerText.includes("not found");
                });

                if (notFound) {
                    await browser.close();
                    return res.status(404).json({ error: "User not found on InterviewBit" });
                }


                scrapedData["User Id"] = id;
                scrapedData["Easy Solved"] = await page.$eval('div.ib-app-root__content > div > div.profile-main > div.profile-activity > div.profile-activity__cards > div:nth-child(1) > div.profile-progress-card__data > div.profile-progress-card__stats > div.profile-progress-card__stat.profile-progress-card__stat--easy > span:nth-child(2)', el => el.textContent.trim());
                scrapedData["Medium Solved"] = await page.$eval('div.ib-app-root__content > div > div.profile-main > div.profile-activity > div.profile-activity__cards > div:nth-child(1) > div.profile-progress-card__data > div.profile-progress-card__stats > div.profile-progress-card__stat.profile-progress-card__stat--medium > span:nth-child(2)', el => el.textContent.trim());
                scrapedData["Hard Solved"] = await page.$eval('div.ib-app-root__content > div > div.profile-main > div.profile-activity > div.profile-activity__cards > div:nth-child(1) > div.profile-progress-card__data > div.profile-progress-card__stats > div.profile-progress-card__stat.profile-progress-card__stat--hard > span:nth-child(2)', el => el.textContent.trim());
                scrapedData["Global Rank"] = await page.$eval('div.ib-app-root__content > div > div.profile-overview > div:nth-child(2) > div.profile-overview-stat-table__items > div:nth-child(1) > div.profile-overview-stat-table__item-value', el => el.textContent.trim());
                scrapedData["Problems Solved"] = await page.$eval('div.ib-app-root__content > div > div.profile-overview > div:nth-child(2) > div.profile-overview-stat-table__items > div:nth-child(4) > div.profile-overview-stat-table__item-value', el => el.textContent.trim());

                await browser.close();

                // console.log(scrapedData);
                res.json(scrapedData);

            } catch (error) {
                // console.error("Fetch Error:", error.message);
                res.status(500).json({ error: "Failed to fetch data" });
            }
        } else if (platform === 'hackerearth') {
            const scrapedData = {};

            try {
                const browser = await puppeteer.launch({ headless: "new" });
                const page = await browser.newPage();
                await page.goto(`https://www.hackerearth.com/@${id}`);

                scrapedData["Userid"] = id;
                scrapedData["Level"] = await page.$eval('div.wrapper > div > div > div.right > div:nth-child(1) > div > div.badge-container > div.he-level-badge > div.badge-name.title', el => el.textContent.trim());
                scrapedData["Points"] = await page.$eval('div.wrapper > div > div > div.right > div:nth-child(1) > div > div.metrics-container > div.points.item > div.metric > div.value', el => el.textContent.trim());
                scrapedData["Contest Rating"] = await page.$eval('div.wrapper > div > div > div.right > div:nth-child(1) > div > div.metrics-container > div.contest-ratings.item > div.metric > div.value', el => el.textContent.trim());
                scrapedData["Problems Solved"] = await page.$eval('div.wrapper > div > div > div.right > div:nth-child(1) > div > div.metrics-container > div.problems-solved.item > div.metric > div.value', el => el.textContent.trim());
                scrapedData["Submissions"] = await page.$eval('div.wrapper > div > div > div.right > div:nth-child(1) > div > div.metrics-container > div.submissions.item > div.metric > div.value', el => el.textContent.trim());

                await browser.close();

                // console.log(scrapedData);
                res.json(scrapedData);

            } catch (error) {
                // console.error("Scraping error:", error.message);
                res.status(500).json({ error: "Scraping failed. Check if the profile exists." });
            }
        } else {
            res.status(400).json({ error: "Invalid platform" });
        }
    } catch (error) {
        // console.error("Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(5000, () => console.log("Server running at port 5000"));

module.exports = app;
