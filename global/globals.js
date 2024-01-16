export const genreChecks = {
  total: 10,
  count: 0,
};

export const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const url = `https://www.looperman.com/loops`;

export const createDownloadUrl = (genre) => {
  return `https://www.looperman.com/loops?page=1&gid=${genre}&dir=d`;
};
