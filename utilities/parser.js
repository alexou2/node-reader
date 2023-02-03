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
        let images
        let mangaName


        // mangaLink = 'https://manganato.com/manga-mi989765'


        request(mangaLink, function (error, response, body) {
            let content = body
            // console.log(content)

            // console.log(content)

            let html
            html = content

            const $ = cheerio.load(html);
            // const links = [];
            // const images = [];

            //gets the chapters from the list
            $('.panel-story-chapter-list a').each((index, element) => {
                links.push($(element).attr('href'));
            });

            //gets all of the image links form the page
            $('.info-image img').each((index, element) => {
                images = ($(element).attr('src'));
            });


            $('.panel-breadcrumb .a-h').each((index, element) => {
                mangaName = ($(element).attr('title'));
            });



            links = links.reverse()
            console.log("inks: ", links);
            console.log("images: ", images);
            console.log("mangaName: ", mangaName)


            //calls download function
            for (let i = 0; i < links.length; i++) {
                sem.take(() => {
                    ddl.download(links[i], i, mangaName, sem)
                })
            }
        })


    }
}