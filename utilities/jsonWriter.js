const fs = require('fs');


// let outputContent = () => {
//     let data = fs.readFileSync('./manga.json', 'utf8')
//     data = JSON.parse(data)



//     console.log('name: ', data.mangaName)
//     console.log(`path: ${__dirname}/${data.path}`)
//     console.log('chapter number:', data.chapter_count)
//     console.log(data.chapters.map(chap => chap.chapter1.map(path => path.path)))
// }
// outputContent()


module.exports = {


    getName: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.mangaName
    },

    getPath: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.path
    },

    getCoverPath: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.cover_path
    },

    getChapters: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)

        return data.chapters
    },

    getPathOrder: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8');
        data = JSON.parse(data);

        let pathOrder = data.chapters.map(path => path.chapterPath)

        return pathOrder
    },

    getchapterNames: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8');
        data = JSON.parse(data);

        let chapterNames = data.chapters.map(path => path.chapterName)

        return chapterNames
    },



    // writes a new json file for each manga
    addManga: function (mangaName, path, chapterNameList, chapterPathList, tags, description) {
        let chapters = []
        console.log("started adding mangas")

        for (let j = 0; j < chapterNameList.length; j++) {
            chapterNameList[j] = chapterNameList[j].trim()


            if (chapterNameList[j].endsWith(':')) {
                chapterNameList[j] = chapterNameList[j].slice(0, -1)
            }
            console.log('chapters: ', chapterNameList[j])
        }


        // gives attributes to each chapter
        for (let i = 0; i < chapterNameList.length; i++) {
            chapters.push({
                chapterName: chapterNameList[i],
                sorting_order: i + 1,
                chapterPath: path + "/" + chapterPathList[i],
            })
        }
        console.log(chapterPathList)

        // the attributes of the file
        let mangaJSON = {
            mangaName: mangaName,
            path: path,
            cover_path: path + "/cover.jpg",
            chapter_count: chapters.length,
            tags: tags,
            description: description,
            chapters: chapters,
        }


        // convert JSON object to a string
        const manga = JSON.stringify(mangaJSON, 'null', 2)

        //writes the files
        fs.writeFileSync(`jsonFiles/${mangaName}.json`, (manga), err => {
            if (err) {
                console.log(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`)
            }
        })

    },


    // updates the manga with new infos
    updateManga: function (path, newInfos) {


    },
    newManga: function (mangaName, jsonPath) {

        let mangaStats = []

        mangaStats.push(
            {
                mangaName: mangaName,
                jsonPath: jsonPath,
                coverImage: `manga/${mangaName}/cover.jpg`,
            }
        )


        let allManga = {
            list_of_mangas: mangaStats
        }


        const list = JSON.stringify(allManga, 'null', 2)

        //writes the files
        fs.writeFileSync(`jsonFiles/mangaList.json`, (list), err => {
            if (err) {
                console.log(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`)
            }
        })

    },

    // is called if a manga doesn't have a json
    ifNoJson: function () {


    }


}