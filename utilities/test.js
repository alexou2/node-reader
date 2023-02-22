const manga = require('./jsonWriter')


mangaName = 'I Sold My Life for 10,000 Yen per Year.'

// console.log(manga.getName(mangaName))
// console.log(manga.getChapters(mangaName))
// console.log(manga.getPath(mangaName))
// console.log(manga.getPathOrder(mangaName))
// console.log(manga.getchapterNames(mangaName))


// manga.addManga(mangaName, mangaName, ["1: chapter1: no name: ", "2: chapter2: no name ", "3: chapter1: no name "], [1, 2, 3], 'n/a', 'n/a')

manga.newManga(mangaName, mangaName)
