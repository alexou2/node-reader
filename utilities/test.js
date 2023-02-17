const manga = require('./jsonWriter')


const mangaName = "horimiya"
const path = "manga/horimiya"
const chapterNameList = ["ch1", "ch2", 'ch3', 'ch4', 'ch5']
const chapterPathList = ["ch1", "ch2", 'ch3', 'ch4', 'ch5']

manga.addManga(mangaName, path, chapterNameList, chapterPathList)
console.log(manga.getName(mangaName))
console.log(manga.getChapters(mangaName))
console.log(manga.getPath(mangaName))


// const app = require('express');

// app.get('/', (req, res) => {


// })

