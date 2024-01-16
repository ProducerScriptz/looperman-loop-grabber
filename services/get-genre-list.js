import { launch } from "puppeteer";
import { ua, url } from "../global/globals.js";

// Declare UserAgent for scraping purposes etc.

// Gets the genre list from looperman dynamically
export const getGenreList = async () => {
  // Launch browser and new page
  const browser = await launch({ headless: "new" });
  const page = await browser.newPage();
  console.info("Started headless browser");

  // Set UserAgent
  await page
    .setUserAgent(ua)
    .then(() => console.info(`UserAgent set to: \n ${ua}`));

  // Set screen size
  await page
    .setViewport({ width: 1080, height: 800 })
    .then(() => console.info("Viewport set"));

  // Navigate to the URL
  console.info("Waiting for page to fully load");
  await page
    .goto(url, {
      waitUntil: "networkidle0",
    })
    .then(() => console.info("Page has fully loaded"))
    .catch((err) => console.error(err));

  // Find the notice popup iframe
  const frame = page
    .frames()
    .find((f) => f.url().startsWith("https://cdn.privacy-mgmt.com/"));

  console.info("Found privacy notice");

  // Click the accept button
  await frame
    .click('button[title="Accept"]')
    .then(() => console.info("Privacy policy clicked"));

  //Get the select list into an obj array
  const genreObjArr = await page.$$eval('select[name="gid"] option', (dd) => {
    // Got the HTML option object, now get it into obj array
    let arr = [];
    dd.forEach((e) => {
      let obj = { value: e.value, name: e.textContent };
      arr.push(obj);
    });
    return arr;
  });

  return { page, browser, genreObjArr };
};
