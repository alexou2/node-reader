const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');


// todo before adding json database
// create function to update json files
// finish function for checking if all mangas have json files
// add json files for manganato
// have only one instance for each manga in manga list




module.exports = {

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

    // gets the chapter's names 
    getchapterNames: function (path) {
        let data = fs.readFileSync(`jsonFiles/${path}.json`, 'utf8');
        data = JSON.parse(data);
        let chapterNames = data.chapters.map(path => path.chapterName)

        return chapterNames
    },

    // gets the 
    getAllMangaPath: function () {
        let data = fs.readFileSync(`jsonFiles/mangaList.json`, 'utf8');
        data = JSON.parse(data);

        let AllMangaPath = data.list_of_mangas.map(path => path.path)

        return AllMangaPath
    },

    // gets all manga names
    getAllMangaNames: function () {
        let data = fs.readFileSync(`jsonFiles/mangaList.json`, 'utf8');
        data = JSON.parse(data)

        let AllMangaNames = data.list_of_mangas.map(name => name.mangaName)

        return AllMangaNames
    },



    // writes a new json file for each manga
    addManga: function (mangaName, path, chapterNameList, chapterPathList, tags, description, total) {
        let chapters = []
        console.log("started adding mangas")

        //formats each chapter's name 
        for (let j = 0; j < chapterNameList.length; j++) {
            chapterNameList[j] = chapterNameList[j].trim()

            //removes th null if there is one
            if (chapterNameList[j].endsWith('null')) {
                chapterNameList[j] = chapterNameList[j].slice(0, -6) + '.1'
                console.log("true")
            }

            chapterNameList[j] = chapterNameList[j].trim()
            chapterNameList[j] = sanitizeFilename(chapterNameList[j])


            // removes : from the end of the chapter
            if (chapterNameList[j].endsWith(':')) {
                chapterNameList[j] = chapterNameList[j].slice(0, -1)
            }

            chapterNameList[j] = chapterNameList[j].trim()

        }
        console.log('chapters: ', chapterNameList)

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

        this.newManga(mangaName, `jsonFiles/${mangaName}.json`)
    },




    newManga: function (mangaName, jsonPath) {

        let mangaStats = (
            {
                mangaName: mangaName,
                jsonPath: jsonPath,
                coverImage: `manga/${mangaName}/cover.jpg`,
                path: `manga/${mangaName}`
            }
        )


        let allManga = {
            list_of_mangas: mangaStats
        }


        // updates th file
        let existingData = JSON.parse(fs.readFileSync('jsonFiles/mangaList.json', 'utf-8'));

        existingData.list_of_mangas.push(mangaStats)

        fs.writeFileSync('jsonFiles/mangaList.json', JSON.stringify(existingData, 'null', 2));

        this.outputJson(mangaName)
    },



    // is called if a manga doesn't have a json
    checkJson: function () {

        let mangaFiles = fs.readdirSync("manga");
        let jsonFiles = fs.readdirSync("jsonFiles")

        for (i in mangaFiles) {
            for (j in jsonFiles) {


            }
        }

    },

    outputJson: function (req) {
        console.log("name:", this.getName(req))
        console.log("chapterList:", this.getchapterNames(req))
        console.log("cover file:", this.getCoverPath(req));
        console.log("chapter paths:", this.getChapterPath(req));
        console.log("all manga paths:", this.getAllMangaPath());
        console.log("all manga names:", this.getAllMangaNames());


        let content = this.getAllMangaPath();
        // content = JSON.stringify(content)
        console.log(content)
for (let i = 0; i< content.length;i++) 
console.log("its content:", fs.readdirSync(content[i]))
        
    }


}