// will take every form data into arguments and will extract the data from it to call other functions

const mangadex = require('./mangadex');
const manganato = require('./parser');
const fs = require('fs');
const jsonWriter = require('./jsonWriter');

module.exports = {

    // for the add manga form
    // it will call the function that downloads from the secific site
    downloadManga: function (req) {
        // try {
            console.log('form')
            console.log(req.body.updateJson)
            console.log(req.body)

            let source = JSON.stringify(req.body.source)
            source = source.toLowerCase().replaceAll('"', '')
            console.log('source = ', source)
            switch (source) {

                //if mangadex is the source
                case 'mangadex':
                    mangadex.getMangaID(req.body.mangaName + ' ', req.body.translatedLanguages, parseInt(req.body.baseOffset), req.body.updateJson, req.body.sortBy)
                    console.log('mangadex in ', req.body.translatedLanguages)
                    break;

                // if manganato is the source
                case 'manganato':
                    if ((req.body.mangaName).startsWith("https://chapmanganato.com/") || (req.body.mangaName).startsWith('https://manganato.com/')) {
                        manganato.parse(req.body.mangaName)
                        console.log(`manganato in ${req.body.translatedLanguages}`)
                    } else {
                        console.error("\u0007\nThe URL doesn't come from manganato. Please check the link again.")
                    }
                    break;


                //if no match is found
                default: console.log(`${req.body.source} is not a valid source`)
            }


            // error messages
        // } catch {
        //     console.error('An error occured. Please check your connection with the site.')
        //     console.error('If you are downloading from manganato, check if the link you entered is valid and that you selected manganato as an option')
        //     console.error('If you are downloading from mangadex, please verify that there are chapters translated in the manga that you selected')
        // }

    },



    // will only update chapters for a manga from the form inside the manga page (not available yet)
    // it will download chapters that are newer than the last chapter downloaded
    updateChapterList: function (req) {
        console.log(req.body)

        // add json data to download chapters i other than english
        mangadex.getMangaID(req.body.mangaName + " ", 'en', parseInt(req.body.offset), "", "relevance")

    },


    // will handle the bookmarking of chapters
    bookmarkChap: function (req) {
        console.log(req.body.mangaName)
        console.log(req.body.chapter)
        console.log(req.body.value)

        jsonWriter.setBookmark(req.body.mangaName, req.body.chapter, req.body.value)
    }

}