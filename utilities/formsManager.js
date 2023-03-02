// will take every form data into arguments and will extract the data from it to call other functions

const mangadex = require('./mangadex');
const manganato = require('./parser');
const mangaInfo = require('./jsonWriter');

module.exports = {

    // for the add manga form
    // it will call the function that downloads from the secific site
    addManga: function () {

    },

    // will only update chapters for a manga from the form inside the manga page (not available yet)
    // it will download chapters that are newer than the last chapter downloaded
    addChapters: function () {

    },


    // handles the form to change json attributes
    // will call a function in jsonWriter to modify the json data for the manga
    changeMangaAttributes: function () {

    },

    // will handle the bookmarking of chapters
    bookmarkChap: function () {

    }






}