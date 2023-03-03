const cheerio = require('cheerio');
const fs = require('fs');

const { linkSync } = require("fs");
const { parse } = require('path');

//sets the max number of chapters to download at the same time
const sem = require('semaphore')(5);// I would recomend 5 to 10 with 16gb of ram. else, your terminal might crash


// gets the content of a local html file
// const data = fs.readFileSync('test.html', 'utf8')
const request = require('request');
const { download } = require('./downloader.js');
const ddl = require('./downloader.js')
const sanitizeFilename = require('sanitize-filename');




module.exports = {
    parse: function (mangaLink) {
        console.log('parser started')

        let links = []
        let coverImage
        let mangaName
        let chapterName = []
        let tags = []


        // mangaLink = 'https://manganato.com/manga-mi989765'


        request(mangaLink, function (error, response, body) {
            let content = body
            // console.log(content)

            let html
            html = content

            let $ = cheerio.load(html);

            //gets the chapters from the list
            $('.panel-story-chapter-list a').each((index, element) => {
                links.push($(element).attr('href'));
            });

            //gets all of the image links form the page
            $('.info-image img').each((index, element) => {
                coverImage = ($(element).attr('src'));
            });

            //gets the manga name feom the link near the top of the page
            // $('.panel-breadcrumb .a-h').each((index, element) => {
            //     mangaName = ($(element).attr('title'));
            // });
            mangaName = $('.story-info-right h1').text();



            // gets the chapter's name
            $('.panel-story-chapter-list a').each((index, element) => {
                chapterName.push($(element).attr('title'));
            });

            $('.panel-story-info-description').each((index, element) => {
                tags.push($(element).attr('title'));
            });
            tags.push('lul')
            console.log('tags: ', tags)

            // prints the informations to debug
            links = links.reverse()
            // console.log("inks: ", links);
            // console.log("cover image: ", coverImage);
            // console.log("mangaName: ", mangaName)
            chapterName = chapterName.reverse()

            //replaces problematic characters to avoid causing problems
            for (let i = 0; i < chapterName.length; i++) {
                chapterName[i] = chapterName[i].trim()

                //replaces problematic characters
                // chapterName[i] = chapterName[i].replaceAll(':', '_')
                // chapterName[i] = chapterName[i].replaceAll('?', '_')
                // chapterName[i] = chapterName[i].replaceAll('!', '_')
                chapterName[i] = sanitizeFilename(chapterName[i])

                // removes all of the unwanted characters at the end of the string
                if (chapterName[i].endsWith('_')) {
                    chapterName[i] = chapterName[i].slice(0, -1)
                }
            }
            // console.log("chapters: ", chapterName)


            //calls download function
            //downloads only the cover image
            ddl.getCoverImage(coverImage, mangaName)
            for (let i = 0; i < links.length; i++) {
                sem.take(() => {
                    //calls download function to download the chapters
                    // ddl.download(links[i], chapterName[i], mangaName, sem)
                })
            }
        })
    },



    // gets the manga link from a string
    getMangaLink: function (searchedManga) {
        request(searchedManga, function (error, response, body) {
            let content = body




            let html
            html = content
            // console.log("body ", html)
            $ = cheerio.load(html);


            //gets the link for the first manga to be returned by the search query
            let returnedManga = []

            console.log("\n\nstarted searching form matches\n\n");
            // (async () => {
            console.log("inside async");
            $('.panel-search-story h3 a').each((index, element) => {
                returnedManga.push($(element).attr('href'));

                console.log("in process of returning matches");

                console.log("\n\n\n\nelement", element);
            });

            // console.log(matches)
            console.log("\n\nfinished searching form matches\n\n");


            console.log("returnedmanga", returnedManga)


            console.log('calling parser')
            // parser.parse(returnedManga[0])
            console.log('done!')
            return returnedManga[0]
        }
        )
    },


    //searched sor a specific manga
    searchByName: function (searchedManga) {
        //convert the searched manga string into a search query for manganato
        console.log("input", searchedManga)
        searchedManga[0] = searchedManga[0].replaceAll('\ ', '_')
        searchedManga = 'https://manganato.com/search/story/' + searchedManga;
        console.log("searched manga: ", searchedManga)


        //calls getMangaLink()
        // this.getMangaLink(searchedManga)
        ddl.getMangaLink(searchedManga)
        return searchedManga
    }

}