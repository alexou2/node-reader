// will take every form data into arguments and will extract the data from it to call other functions

const mangadex = require('./mangadex');
const manganato = require('./parser');
const fs = require('fs');
const jsonWriter = require('./jsonWriter');

module.exports = {

    // for the add manga form
    // it will call the function that downloads from the secific site
    downloadManga: function (req) {
        try {
            console.log(req.body.updateJson)

            switch (req.body.source) {

                //if mangadex is the source
                case 'Mangadex':
                    mangadex.getMangaID(req.body.mangaName + ' ', req.body.translatedLanguages, parseInt(req.body.baseOffset), req.body.updateJson)
                    console.log('mangadex in ', req.body.translatedLanguages)
                    break;

                // if manganato is the source
                case 'Manganato':
                    parse.parse(req.body.mangaName)
                    parse.searchByName(req.body.mangaName)
                    console.log(`manganato in ${req.body.translatedLanguages}`)
                    break;


                //if no match is found
                default: console.log(`no valid matches were found for ${req.body.mangaName}`)
            }


            // error messages
        } catch {
            console.error('An error occured. Please check your connection with the site.')
            console.error('If you are downloading from manganato, check if the link you entered is valid and that you selected manganato as an option')
            console.error('If you are downloading from mangadex, please verify that there are chapters translated in the manga that you selected')
        }

    },


    deleteManga: function (mangaName) {

        // a timer of 15 seconds before deleting the folder
        // console.log('THE FILE WILL BE DELETED IN 15 SECONDS.\u0007\u0007')

        console.log(__dirname)
        // deletes the file
        fs.rmdirSync(__dirname + `/../manga/${mangaName}/`);

        console.log('FILE DELETED')




        // let content = fs.readdirSync(__dirname+'/../manga/'+mangaName)
        // console.log(content)
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
    bookmarkChap: function (req) {
        console.log(req.body.mangaName)
        console.log(req.body.chapter)
        console.log(req.body.value)

        jsonWriter.setBookmark(req.body.mangaName, req.body.chapter, req.body.value)
    },

    // will manage the progress tracking for each manga
    updateReadingProgress: function () {

    }
}