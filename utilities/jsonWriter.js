const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');


// todo before adding json database
// create function to update json files
// finish function for checking if all mangas have json files
// add json files for manganato
// have only one instance for each manga in manga list
// if offset for new chapters of existing manga >= existing chapters in json: add chapters at end of list
// if offset is lower: write complete json
// if last new downloaded chapter < old first chapter: add new feed and then add old data
// change sort order from i to the chapter number from mangadex
// 




module.exports = {
    // getters and setters

    // gets the name of the manga 
    getName: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.mangaName
    },

    // gets the path for the manga
    getPath: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.path
    },

    // gets the cover path
    getCoverPath: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)
        return data.cover_path
    },

    // returns the list of chapters
    getChapterPath: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8')
        data = JSON.parse(data)

        let chapterPath = data.chapters.map(path => path.chapterPath)
        return chapterPath
    },

    // gets the chapter's names for a manga 
    getchapterNames: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8');
        data = JSON.parse(data);
        let chapterNames = data.chapters.map(path => path.chapterName)

        return chapterNames
    },

    // gets the description of the manga
    getMangaDesc: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8');
        data = JSON.parse(data);
        let mangaDesc = data.description

        return mangaDesc
    },

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



    getBookmarks: function (path) {
        // reads the json file
        let mangaData = JSON.parse(fs.readFileSync(`jsonFiles/${path}.json`, 'utf-8'));

        let bookmarks = mangaData.chapters.map(book => book.bookmarked)
        console.log(bookmarks)

        return bookmarks
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
    getMangaJson: function (path) {
        // reads the json file and extracts the list of chapters
        let jsonData = JSON.parse(fs.readFileSync(`jsonFiles/${path}.json`, 'utf-8'));
        let chapterPath = jsonData.chapters.map(path => path.chapterPath)

        console.log(chapterPath)
        let elementsToDelete = []


        // searches for each chapter
        for (let i in chapterPath) {

            // finds the chapter number and its name to make a regex
            let chapterNumber = chapterPath[i].split(' ')[1]

            let name = chapterPath[i].replaceAll(/Chapter.?.?.?\d*(\.[1-9])?/ig, '')
            name = name.replaceAll('_', '')


            // let regex = new RegExp("Ch.?.?.?.?.?.?.?.?" + chapterNumber + ".*" + name+"", "ig")
            // let regex = new RegExp(`Ch.?.?.?.?.?.?.?.?${chapterNumber}.*${name}.*`, "ig")
            let regex = new RegExp(`.*${name}.*`, "ig")

            // console.log(regex.test('Chapter 1 Ch title'))
            // let regex = new RegExp(/.*/ig)
            // console.log('name+ chNumber:', name, '      ', chapterNumber)


            let folderContent = (fs.readdirSync(`manga/${path}`))
            // regex = /.*/ig

            let match = folderContent.some(chapter => regex.test(chapter));
            // if (match) {
            //     // console.log(folderContent.some(chapter => regex.test(chapter)))
            //     // elementsToDelete.push(i)
            //     console.log(match)
            //     // this.deleteJsonChapter(folderContent[i], jsonData)
            // }else{
            //     elementsToDelete.push(i)
            // }

            let t = folderContent.some(chapter => regex.exec(chapter));
            console.log("match ; ",t)
            if(!t){
                elementsToDelete.push(i)
                console.log('push', folderContent[i])
            }


            // searches for each chapter in the files
            // if (!fs.existsSync(`manga/${path}/${chapterPath[i]}`)) {
            // if (!fs.existsSync(`manga/${path}/${regex}`)) {

            //     elementsToDelete.push(i)
            //     // console.log(chapterPath[i])
            // }


        }


        // deletes the extra chapters in the json object
        for (let j in elementsToDelete) {
            // delete jsonData.chapters[elementsToDelete[j]]
            jsonData.chapters.splice([elementsToDelete[j]], ([elementsToDelete[j]]));
            console.log('deleted',jsonData.chapters[elementsToDelete[j]])
            console.log(elementsToDelete)
        }


        return jsonData
    },
    deleteJsonChapter: function (str, jsonData) {
        // delete jsonData.chapters[elementsToDelete[j]]
            // jsonData.chapters.splice(str)
    }

}