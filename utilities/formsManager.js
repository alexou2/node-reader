// will take every form data into arguments and will extract the data from it to call other functions

const mangadex = require('./mangadex');
const manganato = require('./parser');
const mangaInfo = require('./jsonWriter');

module.exports = {

    // for the add manga form
    // it will call the function that downloads from the secific site
    downloadManga: function (req) {
        try {
            switch (req.body.source) {
    
                //if mangadex is the source
                case 'Mangadex':
                    mangadex.getMangaID(req.body.mangaName + ' ', req.body.translatedLanguages, parseInt(req.body.baseOffset))
                    console.log('mangadex in ', req.body.translatedLanguages)
                    break;
    
                // if manganato is the source
                case 'Manganato':
                    parse.parse(req.body.mangaName)
                    // parse.searchByName(req.body.mangaName)
                    console.log(`manganato in ${req.body.translatedLanguages}`)
                    break;
    
                //if no match is found
                default: console.log(`no valid matches were found for ${req.body.mangaList}`)
            }
        } catch {
            console.error('An error occured. Please check your connection with the site.')
            console.error('If you are downloading from manganato, check if the link you entered is valid and that you selected manganato as an option')
            console.error('If you are downloading from mangadex, please verify that there are chapters translated in the manga that you selected')
        }

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

    },

    // will manage the progress tracking for each manga
    updateReadingProgress: function () {

    }





}