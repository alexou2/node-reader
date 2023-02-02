const cheerio = require('cheerio');
const fs = require ('fs');
import { download } from './downloader';

const { linkSync } = require("fs");


// gets the content of a local html file
// const data = fs.readFileSync('test.html', 'utf8')
const request = require('request');


let links = []
let images = []



request('https://chapmanganato.com/manga-aa951409/', function (error, response, body) {
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
    images.push($(element).attr('src'));
});

console.log("inks: ", links);
console.log("images: ", images); 
})



