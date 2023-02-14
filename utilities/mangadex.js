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

            let mangaName = resp.data.data.map(manga => manga.attributes.title.en)
            console.log(mangaName)



            // let coverImage = `https://uploads.mangadex.org/covers/${mangaID}/${ma}.png.512.jpg`


            // returns only the first manga returned for simplicity purposes.I might change this later, or I might just forget about is :)
            this.getChapters(mangaID[0], mangaName[0], languages)
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

            let chapterID = resp.data.data.map(chapter => chapter.id)
            // let chapterName = resp.data.data.map(chapter => chapter.attributes.title)

            // console.log(chapterName)

            let chapterTitle = resp.data.data.map(chapter => chapter.attributes.title)

            let chapter = resp.data.data.map(chapter => chapter.attributes.chapter)


            //creates formatted chapter name
            for (let k = 0; k < chapterID.length; k++) {

                chapterName[k] = `chapter ${chapter[k]}_${chapterTitle[k]}`;
            }


            console.log("formattd chapter names", chapterName)
            // for debuging only. prints the mandaIDs as links
            printLinks('chapter', chapterID)



            //gets the cover image from the manga
            try {
                this.getCoverImage(mangaName, mangaID)
            } catch {
                console.log('couldnt get the cover image for this manga')
            }



            // calls the download function and passes each chapter
            for (let j = 0; j < chapterID.length; j++) {

                sem.take(() => {
                    // let j = 0





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
            console.log('pageLinks', pageLinks)
            console.log(pageLinks.length)
            console.log(i)


            let input = ''

            for (const content of pageLinks) {
                console.log(content)
                input += content + '\n'
            }


            // fs.writeFileSync('./test.txt', input);

            // const text = fs.readFileSync('./test.txt', 'utf8')
            // console.log(text)

            this.downloadPages(chapterID, mangaName, chapterName, sem, j, host, chapterHash, data, mangaID)
        })();
    },



    //actually downloads the pages
    downloadPages: function (chapterID, mangaName, chapterName, sem, j, host, chapterHash, data, mangaID) {





        //creates a folder for the manga
        const folderPath = `manga/${mangaName}/${chapterName}`
        fs.mkdirSync(folderPath, { recursive: true });

        // gets the cover timage for the manga
        // try {
        //     this.getCoverImage(mangaName, mangaID)
        // } catch {
        //     console.log('couldnt get the cover image for this manga')
        // }



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
                    console.error('\x1b[91m%s\x1b[0m', `err downloading pages`)
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


                const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}.512.jpg`;

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


}





//for debug purposes
// outputs a mangadex link i order to check the returned ids
function printLinks(type, link) {
    for (let i = 0; i < link.length; i++) {
        console.log(`https://mangadex.org/${type}/${link[i]}`)
    }
}