//downloads chapters from mangadex

// thanks to mangaDe for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex/docs



const axios = require('axios');
const { searchByName } = require('./parser');
//I use semaphores in ord not to fill up my ram by downloading every chapter at the same time
const sem = require('semaphore')(5);//change 5 by any number to change the number of chapters that can be downloaded at the same time

const baseUrl = 'https://api.mangadex.org'





module.exports = {
    //does a search on mangadex.org and returns the 
    getMangaID: async function (title) {


        (async () => {
            const resp = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                params: {
                    title: title
                }
            });
            console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");

            var mangaID = resp.data.data.map(manga => manga.id)
            this.getChapters(mangaID)
        })();

    },


    getChapters: function (mangaID) {
        let chapterLinks

        return chapterLinks
    },


    downloadPages: function () {


    },


    // gets mangas that correspond to the included tags
    filterByTag: function (includedTag, excludedTag) {


    }


}
