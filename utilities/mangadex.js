//downloads chapters from mangadex

// thanks to mangaDe for providing an api to download their chapters
//you can find the documentation for the api here: api.mangadex/docs



const axios = require('axios')
//I use semaphores in ord not to fill up my ram by downloading every chapter at the same time
const sem = require('semaphore')(5);//change 5 by any number to change the number of chapters that can be downloaded at the same time



module.exports = {

    //does a search on mangadex.org and returns the 
    getMangaID: function (searchedManga) {

        return mangaID
    },


    getChapters: function (mangaID) {

        return ChapterLinks
    },


    downloadPages: function () {


    },


    // gets mangas that correspond to the included tags
    filterByTag: function (includedTag, excludedTag) {


    }

}