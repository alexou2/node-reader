//downloads chapters from mangadex

// thanks to mangadex for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex.org/docs


const axios = require('axios');
const searchByName = require('./parser');
const fs = require('fs');
const { text } = require('body-parser');
const https = require('https')
const sanitizeFilename = require('sanitize-filename');



//I use semaphores in order not to fill up my ram by downloading every chapter at the same time. it will stop the program when there is no more semaphores
const sem = require('semaphore')(5);//change 5 by any number to change the number of chapters that can be downloaded at the same time

const baseUrl = 'https://api.mangadex.org'



module.exports = {



    //does a search on mangadex.org and returns the 
    getMangaID: async function (title, languages, baseOffset, updateJson, sortBy) {




        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                maxContentLength: Infinity,
                params: {
                    title: title,
                    // "order[relevance]": "desc",
                    // "order[followedCount]": "desc", 
                    [`order[${sortBy}]`]: "desc",
                }

            });
            console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");


            let mangaID = resp.data.data.map(manga => manga.id)



            // fetches the first manga name in the mangadex list
            let mangaName = resp.data.data.map(manga => manga.attributes.title)
            console.log(mangaName)
            mangaName = mangaName[0]
            mangaName = JSON.stringify(mangaName)
            console.log()
            mangaName = mangaName.split('"')
            mangaName = mangaName[3]
            console.log(mangaName)
            // removes the space at the end of the name
            mangaName = mangaName.trim()
            mangaName = sanitizeFilename(mangaName)
            // mangaName = mangaName.replaceAll('%', '%25')

            // fetches the alternative titles for the manga
            // let altTitles = resp.data.data.map(manga => manga.attributes.altTitles)
            let altTitles = resp.data.data.map(manga => manga.attributes.altTitles.map(altTitle => altTitle))



            // gets informations about the manga like status, tags, demographic
            console.log(altTitles)
            let tags = resp.data.data.map(manga => manga.attributes.tags.map(attributes => attributes.attributes.name.en))
            let status = resp.data.data.map(manga => manga.attributes.status)
            let description = resp.data.data.map(manga => manga.attributes.description.en)
            console.log(altTitles, tags[0], status, description[0])



            // gets all of the informations from mangadex
            this.writeJson(mangaID[0], mangaName, languages, baseOffset, tags[0], status[0], description[0], altTitles[0])



            // downloads the manga
            if (!updateJson) {
                // downloads the chapters
                this.getChapters(mangaID[0], mangaName, languages, baseOffset)
            }



        })();

    },




    //gets the chapterIDs for the chapter entered
    getChapters: function (mangaID, mangaName, languages, baseOffset) {
        let chapterName = [];
        let chapter = [];
        let chapterTitle = [];
        let chapterID = [];
        let resp

        (async () => {
            // for (let i = 0; i < 10&& resp != ""; i++) {
            let i = 0
            do {
                resp = await axios({
                    method: 'GET',
                    url: `${baseUrl}/manga/${mangaID}/feed?includeExternalUrl=0`,
                    maxContentLength: Infinity,

                    // parameters to filter the mangas
                    params: {
                        "order[chapter]": "asc", //sorts the chapter list 
                        "translatedLanguage[]": languages, //will only return one specific language 
                        "offset": 100 * i + baseOffset,
                    },

                });

                console.log(resp.data.data.map(chapter => chapter.id));

                // gets informations from the chapters 
                chapterID = chapterID.concat(resp.data.data.map(chapter => chapter.id))

                chapterTitle = chapterTitle.concat(resp.data.data.map(chapter => chapter.attributes.title))

                chapter = chapter.concat(resp.data.data.map(chapter => chapter.attributes.chapter))

                i++
            } while (resp.data.data != "")

            //creates formatted chapter name
            for (let k = 0; k < chapterID.length; k++) {

                chapterName[k] = `Chapter ${chapter[k]} ${chapterTitle[k]}`;
                chapterName[k] = chapterName[k].trim()
                chapterName[k] = sanitizeFilename(chapterName[k])

                //removes th null if there is one
                if (chapterName[k].endsWith(null)) {
                    chapterName[k] = chapterName[k].slice(0, -5) + '.1'
                }
                chapterName[k] = chapterName[k].trim()
                // if there is an underscore it will remove it
                // if (chapterName[k].endsWith('_')) {
                //     console.log(chapterName[k])
                //     chapterName[k] = chapterName[k].slice(0, -1)
                //     console.log('chapters:', chapterName[k])
                // }
                // chapterName[k] = chapterName[k].trim();


            }
            chapterName = this.filterArr(chapterName)
            chapterID = this.filterArr(chapterID)

            console.log('chapter names:', chapterName)
            //gets the cover image from the manga
            try {
                this.getCoverImage(mangaName, mangaID)
            } catch {
                console.error('couldnt get the cover image for this manga')
            }



            // calls the download function and passes each chapter
            for (let j = 0; j < chapterID.length; j++) {

                sem.take(() => {

                    this.getChapterInfos(chapterID[j], mangaName, chapterName[j], sem, j, mangaID)
                    console.log('\x1b[94m%s\x1b[0m', `started ${chapterName[j]}`)

                })
            }

        })();
    },


    //gets all of the informations from mangadex in order to download chapters
    getChapterInfos: function (chapterID, mangaName, chapterName, sem, j, mangaID) {


        let host, chapterHash, data, dataSaver;

        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/at-home/server/${chapterID}`,
                maxContentLength: Infinity,
            });

            host = resp.data.baseUrl;
            chapterHash = resp.data.chapter.hash;
            data = resp.data.chapter.data;
            dataSaver = resp.data.chapter.dataSaver;



            let i = 0
            let pageLinks = []
            for (const page of data) {
                pageLinks.push(`${host}/data/${chapterHash}/${page}`)
                i++
            }
            // console.log('pageLinks', pageLinks)
            // console.log(pageLinks.length)

            this.downloadPages(chapterID, mangaName, chapterName, sem, j, host, chapterHash, data)
        })();
    },



    //actually downloads the pages
    downloadPages: function (chapterID, mangaName, chapterName, sem, j, host, chapterHash, data) {


        //creates a folder for the manga
        let folderPath = `manga/${sanitizeFilename(mangaName)}/${chapterName}`
        fs.mkdirSync(folderPath, { recursive: true });
        // console.log(folderPath);


        //downloads the pages in the correct folderw
        (async () => {
            for (const page of data) {
                try {
                    const resp = await axios({
                        method: 'GET',
                        url: `${host}/data/${chapterHash}/${page}`,
                        maxContentLength: Infinity,
                        responseType: 'arraybuffer'
                    });

                    fs.writeFileSync(`${folderPath}/${page}`, resp.data);
                    // console.log('page downloaded: ', folderPath, page)
                } catch {
                    console.error('\x1b[91m%s\x1b[0m', `err downloading ${page}`)
                }
            };

            console.log(`Downloaded ${data.length} pages.`);



            console.log("\x1b[33m%s\x1b[0m", "  finished ", chapterName, "\n")
            sem.leave(1)
        })();
    },



    //get the cover image from mangadex for the downloaded chapter
    getCoverImage: function (mangaName, mangaID) {
        const folderPath = `./manga/${sanitizeFilename(mangaName)}`;
        fs.mkdirSync(folderPath, { recursive: true });

        // const mangaID = '6d0e8d89-9b15-4155-af91-896d0c1b476b';
        try {
            (async () => {
                const resp = await axios({
                    method: 'GET',
                    url: `https://api.mangadex.org/cover?limit=10&manga%5B%5D=${mangaID}&includes%5B%5D=manga`,
                    maxContentLength: Infinity,
                });

                let cover_fileName = resp.data.data.map(manga => manga.attributes.fileName);

                // cover_fileName = cover_fileName.split(',');
                cover_fileName = cover_fileName[0]


                const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}.256.jpg `;
                console.log(coverLink)

                let coverName = cover_fileName.split('.')
                coverName = `cover.jpg`

                const file = fs.createWriteStream(`${folderPath}/${coverName}`);
                https.get(coverLink, function (response) {
                    response.pipe(file);
                });

                console.log(`Downloaded file: ${coverName}`);

            })();

        } catch {
            console.log('error when downloading cover drom mangadex')
        }

    },


    // gets informations and sends them to be written in a json file
    writeJson: function (mangaID, mangaName, languages, baseOffset, tags, status, description) {

        const mangaJSON = require('./jsonWriter');
        let chapterName = [];

        (async () => {

            let chapterID = []
            let chapterTitle = []
            let chapter = []
            let chapterPath = []
            let resp;
            // will need to change the number of requests made
            let i = 0
            // for (let i = 0; i < 10 && resp != ""; i++) {
            do {
                // const resp = await axios({
                resp = await axios({

                    method: 'GET',
                    url: `${baseUrl}/manga/${mangaID}/feed?includeExternalUrl=0`,
                    maxContentLength: Infinity,

                    // parameters to filter the mangas
                    params: {
                        "order[chapter]": "asc", //sorts the chapter list 
                        "translatedLanguage[]": languages, //will only return one specific language 
                        "offset": 100 * i,
                    },


                });

                chapterID = chapterID.concat(resp.data.data.map(chapter => chapter.id))

                chapterTitle = chapterTitle.concat(resp.data.data.map(chapter => chapter.attributes.title))

                chapter = chapter.concat(resp.data.data.map(chapter => chapter.attributes.chapter))

                i++
            } while (resp.data.data != "")

            //creates formatted chapter name

            for (let k = 0; k < chapterID.length; k++) {
                chapterName[k] = `Chapter ${chapter[k]}: ${chapterTitle[k]}`;
                // chapterPath[k] = chapterName[k].replaceAll(':', '_');
                // chapterPath[k] = sanitizeFilename(chapterPath[k])
            }
            let path = `manga/${mangaName}`
            // path = path.replaceAll(' ', '\ ')



            chapterName = this.filterArr(chapterName)



            mangaJSON.addManga(mangaName, path, chapterName, tags, description)

        })();
    },
    // removes duplicates in an array
    // used to remove duplicate chapters
    filterArr: function (arr) {
        console.log(arr)

        return arr.filter((item,
            index) => arr.indexOf(item) == index);
    },

    autocomplete: async function (title) {
        
        const resp = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            maxContentLength: Infinity,
            params: {
                title: title,
                "order[relevance]": "desc",
            }
        }).then(t => t.data);

        // let mangaName = resp.data.data.map(manga => manga.attributes.title);
        // console.log(resp.data.map(t => t.attributes.title))

        let mangaName = resp.data.map(t => t.attributes.title)
for (let i in mangaName){
        mangaName[i] = JSON.stringify(mangaName[i])
        // console.log()
        mangaName[i] = mangaName[i].split('"')
        mangaName[i] = mangaName[i][3]
}
        return mangaName
    }


}