import inquirer from "inquirer";

// Display the genre list for selections
export const displayGenreList = async (genreObjArr) => {
  try {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "genre",
        message: "Choose a genre...",
        choices: genreObjArr,
      },
    ]);
    return answer;
  } catch (error) {
    console.error(`Error displaying genre list: ${error.message}`);
    throw error;
  }
};
