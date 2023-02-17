const manga = require('./jsonWriter')


const mangaName = "horimiya"
const path = "manga/horimiya"
const chapterNameList = ["ch1", "ch2", 'ch3', 'ch4', 'ch5']
const chapterPathList = ["ch1", "ch2", 'ch3', 'ch4', 'ch5']

manga.addManga(mangaName, path, chapterNameList, chapterPathList)
console.log(manga.getName("jsonFiles/horimiya.json"))
console.log(manga.getChapters("jsonFiles/horimiya.json"))
console.log(manga.getPath("jsonFiles/horimiya.json"))

