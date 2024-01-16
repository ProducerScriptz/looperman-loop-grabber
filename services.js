import { launch } from "puppeteer";
import download from "download";
import inquirer from "inquirer";
import { getValueByKey } from "./helpers.js";
import path from "path";
import { fileURLToPath } from "url";

// Declare UserAgent for scraping purposes etc.
const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Construct directory to save to
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the root directory
const filePath = `${__dirname}\\loops`;

// Gets the genre list from looperman dynamically
export const getGenreList = async () => {
  const url = `https://www.looperman.com/loops`;

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

// Main entry function for the program
export const getLatestLoops = async (page, browser, genreObjArr) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "genre",
        message: "Choose a genre...",
        choices: genreObjArr,
      },
    ])
    .then(async (answer) => {
      // Go off and download the loops with the chosen genre
      await downloadLoops(page, browser, answer.genre, genreObjArr);
    });
};

// Download function that handles all processing
const downloadLoops = async (page, browser, genre, genreList) => {
  // Construct url
  const url = `https://www.looperman.com/loops?page=1&gid=${genre}&dir=d`;

  // We're in! On genre page
  await page
    .goto(url, {
      waitUntil: "networkidle0",
    })
    .then(() => console.info("Page has fully loaded"));

  // Get all links and map to an array
  const listOfLinks = await page
    .$$eval("div.player-wrapper", (opt) =>
      opt.map((div) => (links = div.getAttribute("rel")))
    )
    .then(console.info("Got all download links"));

  // Construct the correct file path for genre.
  const filePathToGenre = `${filePath}\\${getValueByKey(genreList, genre)}`;

  // Start timer
  let start = Date.now();

  //loop through array and download each one
  for (const [i, file] of listOfLinks.entries()) {
    await download(file, filePathToGenre)
      .then(() => {
        // Log download state
        console.log(`Download Complete: ${i + 1} of ${listOfLinks.length}`);
      })
      .catch((err) => console.error(err));
  }

  // Calculate the time taken
  let timeTaken = Date.now() - start;

  // Downloads completed
  console.info("-----------------------------------");
  console.info(`Download completed in ${Math.floor(timeTaken / 1000)} seconds`);
  console.info("-----------------------------------");
  // Show location of loops
  console.info(
    `${listOfLinks.length} new loops in project folder:\n${filePathToGenre}`
  );
  console.info("-----------------------------------");

  // Close browser
  await browser.close();
};
