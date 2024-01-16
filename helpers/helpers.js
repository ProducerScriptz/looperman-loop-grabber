/*
  Helper functions 
 */

// Get an objects value by its key
export const getValueByKey = (object, key) => {
  let name = "";
  object.forEach((genres) => {
    if (genres.value == key) {
      name = genres.name;
    }
  });
  return name.trim();
};
