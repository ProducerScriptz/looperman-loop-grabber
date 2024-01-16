import { createRequire } from "module";
import { displayGenreList } from "./ui/display-genre-list.js";
import { getGenreList } from "./services/get-genre-list.js";
import { downloadLoops } from "./services/download-loops.js";
import { filePath } from "./utils/file-path.js";
import { createDownloadUrl } from "./global/globals.js";

// Get access to require a package.
const require = createRequire(import.meta.url);
// Get access to package.json
const pkg = require("./package.json");

// Start the application
console.log(`Starting ${pkg.name} - ${pkg.version}`);

// -> Entry point
(async () => {
  // Get the genre list from looperman
  const getList = await getGenreList();

  // Display UI and return the selected genre
  const answer = await displayGenreList(getList.genreObjArr);

  // Download the Loops
  await downloadLoops(
    getList.page,
    getList.browser,
    answer.genre,
    getList.genreObjArr,
    filePath,
    createDownloadUrl(answer.genre)
  );
})();
