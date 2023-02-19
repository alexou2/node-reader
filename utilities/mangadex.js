//downloads chapters from mangadex

// thanks to mangadex for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex.org/docs


const axios = require('axios');
const { searchByName } = require('./parser');
const fs = require('fs');
const { text } = require('body-parser');
const https = require('https')

//I use semaphores in order not to fill up my ram by downloading every chapter at the same time. it will stop the program when there is no more semaphores
const sem = require('semaphore')(10);//change 5 by any number to change the number of chapters that can be downloaded at the same time

const baseUrl = 'https://api.mangadex.org'



module.exports = {



    //does a search on mangadex.org and returns the 
    getMangaID: async function (title, languages) {


        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                maxContentLength: Infinity,
                params: {
                    title: title,
                    "order[relevance]": "desc",
                }

            });
            console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");


            var mangaID = resp.data.data.map(manga => manga.id)

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

            // fetches the alternative titles for the manga
            let altTitles = resp.data.data.map(manga => manga.attributes.altTitles)
            console.log(altTitles)










            // gets all of the informations from mangadex
            this.writeJson(mangaID[0], mangaName, languages)





















            this.getChapters(mangaID[0], mangaName, languages)



















        })();

    },




    //gets the chapterIDs for the chapter entered
    getChapters: function (mangaID, mangaName, languages) {
        let chapterName = [];

        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaID}/feed`,
                maxContentLength: Infinity,

                // parameters to filter the mangas
                params: {
                    "order[chapter]": "asc", //sorts the chapter list 
                    "translatedLanguage[]": languages //will only return one specific language 
                },

            });

            console.log(resp.data.data.map(chapter => chapter.id));

            // gets informations from the chapters 
            let chapterID = resp.data.data.map(chapter => chapter.id)

            let chapterTitle = resp.data.data.map(chapter => chapter.attributes.title)

            let chapter = resp.data.data.map(chapter => chapter.attributes.chapter)


            //creates formatted chapter name
            for (let k = 0; k < chapterID.length; k++) {

                chapterName[k] = `chapter ${chapter[k]}_ ${chapterTitle[k]}`;
                chapterName[k] = chapterName[k].trim()

                //removes th null if there is one
                if (chapterName[k].endsWith('null')) {
                    chapterName[k] = chapterName[k].slice(-3, 0)
                }
                chapterName[k] = chapterName[k].trim()
                // if there is an underscore it will remove it
                if (chapterName[k].endsWith('_')) {
                    chapterName[k] = chapterName[k].slice(-1, 0)
                }
                chapterName[k] = chapterName[k].trim()


            }



            //gets the cover image from the manga
            try {
                this.getCoverImage(mangaName, mangaID)
            } catch {
                console.error('couldnt get the cover image for this manga')
            }



            // calls the download function and passes each chapter
            for (let j = 0; j < chapterID.length; j++) {

                sem.take(() => {

                    this.getInfos(chapterID[j], mangaName, chapterName[j], sem, j, mangaID)
                    console.log('\x1b[94m%s\x1b[0m', `started ${chapterName[j]}`)

                })
            }

        })();
    },


    //gets all of the informations from mangadex in order to download chapters
    getInfos: function (chapterID, mangaName, chapterName, sem, j, mangaID) {


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
            console.log(pageLinks.length)

            this.downloadPages(chapterID, mangaName, chapterName, sem, j, host, chapterHash, data)
        })();
    },



    //actually downloads the pages
    downloadPages: function (chapterID, mangaName, chapterName, sem, j, host, chapterHash, data) {


        //creates a folder for the manga
        const folderPath = `manga/${mangaName}/${chapterName}`
        fs.mkdirSync(folderPath, { recursive: true });



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

                    // console.log(`${folderPath}/${page}`, resp.data)
                    fs.writeFileSync(`${folderPath}/${page}`, resp.data);
                    console.log('page downloaded')
                } catch {
                    console.error('\x1b[91m%s\x1b[0m', `err downloading ${page}`)
                }
            };

            console.log(`Downloaded ${data.length} pages.`);



            console.log("\x1b[33m%s\x1b[0m", "  finished ", chapterName, "\n")
            sem.leave(1)
        })();
    },




    // gets mangas that correspond to the included tags
    filterByTag: function (includedTag, excludedTag) {


    },


    //get the cover image from mangadex for the downloaded chapter
    getCoverImage: function (mangaName, mangaID) {
        const folderPath = `./manga/${mangaName}`;
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


                const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}.256.jpg`;

                let coverName = cover_fileName.split('.')
                coverName = `cover.${coverName[1]}`

                const file = fs.createWriteStream(`${folderPath}/${coverName}`);
                https.get(coverLink, function (response) {
                    response.pipe(file);
                });

                console.log(`Downloaded file: ${coverName}`);

            })();

        } catch {
            console.log('error when downloading covre drom mangadex')
        }

    },

    // gets informations and sends them to be written in a json file
    writeJson: function (mangaID, mangaName, languages) {

        const mangaJSON = require('./jsonWriter');
        let chapterName = [];

        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaID}/feed`,
                maxContentLength: Infinity,

                // parameters to filter the mangas
                params: {
                    "order[chapter]": "asc", //sorts the chapter list 
                    "translatedLanguage[]": languages //will only return one specific language 
                },

            });

            let chapterID = resp.data.data.map(chapter => chapter.id)

            let chapterTitle = resp.data.data.map(chapter => chapter.attributes.title)

            let chapter = resp.data.data.map(chapter => chapter.attributes.chapter)
            //creates formatted chapter name

            for (let k = 0; k < chapterID.length; k++) {
                chapterName[k] = `chapter ${chapter[k]}: ${chapterTitle[k]}`;
            }

            let path = `manga/${mangaName}`


            mangaJSON.addManga(mangaName, path, chapterName, chapterName, "n/a", "n/a")

        })();
    }
}