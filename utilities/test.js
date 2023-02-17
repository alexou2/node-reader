const manga = require('./jsonWriter')


mangaName = 'I Sold My Life for 10,000 Yen per Year.'

console.log(manga.getName(mangaName))
console.log(manga.getChapters(mangaName))
console.log(manga.getPath(mangaName))
console.log(manga.getPathOrder(mangaName))
console.log(manga.getchapterNames(mangaName))