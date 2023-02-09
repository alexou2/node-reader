//downloads chapters from mangadex

// thanks to mangaDe for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex/docs



const axios = require('axios');
const { searchByName } = require('./parser');

//I use semaphores in order not to fill up my ram by downloading every chapter at the same time
const sem = require('semaphore')(5);//change 5 by any number to change the number of chapters that can be downloaded at the same time

const baseUrl = 'https://api.mangadex.org'


const languages = 'en'


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




            // returns only the first manga returned for simplicity purposes.I might change this later, or I might just forget about is :)
            this.getChapters(mangaID[0])
        })();

    },


    //sorts the returned chapters by which one is the most popular in order to avoid downloading the wrong manga
    sortByPopular: function (mangaID) {
        //sets the order for the sorting function
        const order = {
            rating: 'desc',
            followedCount: 'desc'
        };
    },



    //gets the chapterIDs for the chapter entered
    getChapters: function (mangaID) {
        let chapterLinks

        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga/${mangaID}/feed`,
                params: {
                    "order[chapter]": "asc",
                    "translatedLanguage[]": languages
                },


            });

            console.log(resp.data.data.map(chapter => chapter.id));
            let chapterLinks = resp.data.data.map(chapter => chapter.id)

            // for debuging only. prints the mandaIDs as links
            printLinks('chapter', chapterLinks)
        })();


        return chapterLinks
    },



    downloadPages: function () {


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