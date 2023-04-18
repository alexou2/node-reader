const { json } = require('body-parser');
const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');



module.exports = {

    // bookmarks or un-bookmarks chapters
    setBookmark: function (path, chapter, value) {


        let mangaData = JSON.parse(fs.readFileSync(`jsonFiles/${path}.json`, 'utf-8'));

        let bookmarkedChap = mangaData.chapters.find(obj => obj.chapterPath === chapter);
        console.log('searching for:', chapter)
        console.log(bookmarkedChap)
        console.log('search result:', bookmarkedChap.chapterPath, bookmarkedChap.bookmarked)

        bookmarkedChap.bookmarked = value;
        // console.log('data ', existingData)
        console.log('data to write:', mangaData)

        fs.writeFileSync(`jsonFiles/${path}.json`, JSON.stringify(mangaData, 'null', 2));
    },






    // adds the manga's informations to a json file
    addManga: function (mangaName, path, chapterName, tags, description) {
        let chapters = []
        let chapterPath = []
        console.log("started creating json to manga")

        //formats each chapter's name and path
        for (let j = 0; j < chapterName.length; j++) {
            chapterName[j] = chapterName[j].trim()

            //removes th null if there is one
            if (chapterName[j].endsWith('null')) {
                chapterName[j] = chapterName[j].slice(0, -6) + '.1'
            }

            chapterName[j] = chapterName[j].trim()

            // removes : from the end of the chapter
            if (chapterName[j].endsWith(':')) {
                chapterName[j] = chapterName[j].slice(0, -1)
            }

            chapterName[j] = chapterName[j].trim()

            chapterPath[j] = sanitizeFilename(chapterName[j])
        }
        console.log('chapters: ', chapterName)


        // creates json object for each chapter
        for (let i = 0; i < chapterName.length; i++) {
            chapters.push({
                chapterName: chapterName[i],
                sorting_order: i + 1,
                chapterPath: chapterPath[i],
                bookmarked: 'false',
            })
        }
        console.log('chapter paths:', chapterPath)

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


        // convert JSON object to a string to write in the json
        const manga = JSON.stringify(mangaJSON, 'null', 2)

        //writes the files
        fs.writeFileSync(`jsonFiles/${mangaName}.json`, (manga), err => {
            if (err) {
                console.error(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`)
            }
        })

    },

    // is called if a manga doesn't have a json
    checkJson: function (mangaName) {

        // for (let i = 0; i < mangaFiles.length; i++) {
        if (!fs.existsSync(`jsonFiles/${mangaName}.json`)) {
            console.log(__dirname)
            this.createJsonFromFiles(mangaName)
            console.log('created missing jsons for manga')
        }


    },


    // scans files and looks for informations for the  if there is no json for th manga
    createJsonFromFiles: function (mangaName) {

        let chapterNameList
        let path
        let jsonPath

        jsonPath = `jsonFiles/${mangaName}.json`
        path = `manga/${mangaName}`


        chapterNameList = fs.readdirSync(`manga/${mangaName}`)



        // creates the json file for this manga
        this.addManga(mangaName, path, chapterNameList, "n/a", "n/a")
    },


    // will return the informations for the requested manga, without informations for chapters that are not available
    getMangaJson: function (path, folderContent) {
        // reads the json file and extracts the list of chapters
        let jsonData = JSON.parse(fs.readFileSync(`jsonFiles/${path}.json`, 'utf-8'));
        let chapterPath = jsonData.chapters.map(path => path.chapterPath)

        if (folderContent == "") {
            let folderContent = (fs.readdirSync(`manga/${path}`))
        }
        // console.log(chapterPath)
        let elementsToDelete = []


        // searches for each chapter
        for (let i in chapterPath) {

            // finds the chapter number 
            let chapterNumber = chapterPath[i].split(' ')[1]

            // finds each chapter's name
            let name = chapterPath[i].replaceAll(/Chapter.?.?.?\d*(\.[1-9])?/ig, '')
            name = name.replaceAll('_', '')
            name = name.replaceAll(':', '')
            name = sanitizeFilename(name)
            name = name.replaceAll('(', '.?')
            name = name.replaceAll(')', '.?')
            name = name.trim()
            // console.log('name', name, chapterNumber)

            let regex = new RegExp(`Ch.?.?.?.?.?.?.?.?${chapterNumber}.*${name}.*`, "ig")



            // tries to match chapters in the json file to a downloaded chapter
            let match = folderContent.some(chapter => regex.test(chapter));
            if (!match && jsonData.chapter_count > folderContent.length + 1) {
                // console.log('not there', chapterPath[i])
                elementsToDelete.push(i)
                // console.log('push', jsonData.chapters[i])
            }
            if (folderContent[i] == (chapter => regex.test(chapter))) {
                console.log('name changed')
            }

        }


        // deletes the extra chapters in the json object
        if (elementsToDelete.length > 0) {
            for (let j in elementsToDelete) {
                // deletes the elements to delete
                jsonData.chapters.splice(([elementsToDelete[j]] - j), 1);
            }
        }

        return jsonData
    },
    deleteManga: function (mangaName) {
        // deletes json file
        try {
            fs.rmSync(`/jsonFiles/${mangaName.json}.json`);
        } catch {
            console.error('There is no json file corresponding to be deleted')
        }

        try {
            fs.rmSync(`/manga/${mangaName}`, ({ recursive: true }))
        } catch {
            console.error(`manga can't be deleted`)

        }


    }
}