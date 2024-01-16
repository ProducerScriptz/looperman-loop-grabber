import download from "download";
import { getValueByKey } from "../helpers/helpers.js";

// Download function that handles all processing
export const downloadLoops = async (
  page,
  browser,
  genre,
  genreList,
  path,
  url
) => {
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
  const filePathToGenre = `${path}\\${getValueByKey(genreList, genre)}`;

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
