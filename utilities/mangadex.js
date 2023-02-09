//downloads chapters from mangadex

// thanks to mangadex for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex.org/docs


const axios = require('axios');
const { searchByName } = require('./parser');
const fs = require('fs')

//I use semaphores in order not to fill up my ram by downloading every chapter at the same time. it will stop the program when there is no more semaphores
const sem = require('semaphore')(5);//change 5 by any number to change the number of chapters that can be downloaded at the same time

const baseUrl = 'https://api.mangadex.org'

//will only get chapters translated in this language
const languages = 'en'// modify this if you want to get chapters in another language


module.exports = {
    //does a search on mangadex.org and returns the 
    getMangaID: async function (title) {


        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                params: {
                    title: title,
                    "order[relevance]": "desc",
                }

            });
            console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");


            var mangaID = resp.data.data.map(manga => manga.id)

            let mangaName = resp.data.data.map(manga => manga.attributes.title.en)
            console.log(mangaName)


            // returns only the first manga returned for simplicity purposes.I might change this later, or I might just forget about is :)
            this.getChapters(mangaID[0], mangaName[0])
        })();

    },



    //gets the chapterIDs for the chapter entered
    getChapters: function (mangaID, mangaName) {
        let chapterName = [];

        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaID}/feed`,

                // parameters to filter the mangas
                params: {
                    "order[chapter]": "asc", //sorts the chapter list 
                    "translatedLanguage[]": languages //will only return one specific language 
                },

            });

            console.log(resp.data.data.map(chapter => chapter.id));

            let chapterIDs = resp.data.data.map(chapter => chapter.id)
            // let chapterName = resp.data.data.map(chapter => chapter.attributes.title)

            // console.log(chapterName)

            //gets the chapter's name
            for (let k = 0; k < chapterIDs.length; k++) {


                chapterName = resp.data.data.map(chapter => chapter.attributes.chapter)

                // mangaName = `chapter ${k} ${mangaName}`;


            }
            console.log(chapterName)
            // for debuging only. prints the mandaIDs as links
            printLinks('chapter', chapterIDs)



            // calls the download function and passes each chapter
            for (let j = 0; j < chapterIDs.length; j++) {
                console.log('\x1b[94m%s\x1b[0m', `started chapter #${j}`)
                sem.take(() => {
                    this.downloadPages(chapterIDs[j], mangaName, sem, j)
                })
            }

        })();
    },




    downloadPages: function (chapterIDs, mangaName, sem, j) {






        sem.leave(1)
        console.log("\x1b[33m%s\x1b[0m", "  finished chaptrer", j, "\n")
    },




    // gets mangas that correspond to the included tags
    filterByTag: function (includedTag, excludedTag) {


    }


}
//for debug purposes
// outputs a mangadex link i order to check the returned ids
function printLinks(type, link) {
    for (let i = 0; i < link.length; i++) {
        console.log(`https://mangadex.org/${type}/${link[i]}`)
    }
}