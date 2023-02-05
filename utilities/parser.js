const cheerio = require('cheerio');
const fs = require('fs');

const { linkSync } = require("fs");
const { parse } = require('path');
const sem = require('semaphore')(5);


// gets the content of a local html file
// const data = fs.readFileSync('test.html', 'utf8')
const request = require('request');
const ddl = require('./downloader.js')



module.exports = {
    parse: function (mangaLink) {

        let links = []
        let coverImage
        let mangaName
        let chapterName = []


        // mangaLink = 'https://manganato.com/manga-mi989765'


        request(mangaLink, function (error, response, body) {
            let content = body
            // console.log(content)

            // console.log(content)

            let html
            html = content

            const $ = cheerio.load(html);

            //gets the chapters from the list
            $('.panel-story-chapter-list a').each((index, element) => {
                links.push($(element).attr('href'));
            });

            //gets all of the image links form the page
            $('.info-image img').each((index, element) => {
                coverImage = ($(element).attr('src'));
            });

            //gets the manga name feom the link near the top of the page
            $('.panel-breadcrumb .a-h').each((index, element) => {
                mangaName = ($(element).attr('title'));
            });


            $('.panel-story-chapter-list a').each((index, element) => {
                chapterName.push($(element).attr('title'));
            });

            // prints the informations to debug
            links = links.reverse()
            console.log("inks: ", links);
            console.log("cover image: ", coverImage);
            console.log("mangaName: ", mangaName)
            chapterName = chapterName.reverse()

            //replaces spaces with a backslash before the space
            for (let i = 0; i < chapterName.length; i++) {
                chapterName[i] = chapterName[i].replaceAll(':', '_ ')
                chapterName[i] = chapterName[i].replaceAll('?', '_ ')
                chapterName[i] = chapterName[i].replaceAll('!', '_ ')

            }
            console.log("chapters: ", chapterName)


            //calls download function
            //downloads only the cover image
            ddl.getCoverImage(coverImage, mangaName)
            for (let i = 0; i < links.length; i++) {
                sem.take(() => {
                    //calls download function to download the chapters
                    ddl.download(links[i], chapterName[i], mangaName, sem)
                })
            }
        })
    },

    // gets the manga link from a string
    getMangaLink: function (searchedManga) {

        //convert the searched manga string into a search query for manganato
        console.log(searchedManga)
        searchedManga[0] = searchedManga[0].replaceAll('\ ', '_')
        searchedManga = 'https://manganato.com/search/story/'+searchedManga;
        console.log(searchedManga)

return searchedManga
    }

}