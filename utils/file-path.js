import path, { join } from "path";
import { fileURLToPath } from "url";

// Construct directory to save to
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file

const __dirname = path.dirname(__filename); // get the name of the root directory

// Navigate up one level to the root directory
const rootDir = join(__dirname, "..");

export const filePath = join(rootDir, "loops");
