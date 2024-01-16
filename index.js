import { getGenreList, getLatestLoops } from "./services.js";
import { createRequire } from "module";

// Get access to require a package.
const require = createRequire(import.meta.url);
// Get access to package.json
const pkg = require("./package.json");

// Start the application
console.log(`Starting ${pkg.name} - ${pkg.version}`);

// -> Entry point
(async () => {
  // get the genre list
  await getGenreList()
    .then((result) => {
      // Get return from getGenreList()
      const page = result.page;
      const browser = result.browser;
      const objArr = result.genreObjArr;
      // Go off and download latest loops
      getLatestLoops(page, browser, objArr);
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error:", error);
    });
})().catch((err) => console.error(err));
