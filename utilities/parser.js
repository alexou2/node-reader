const cheerio = require('cheerio');
const fs = require ('fs')


// gets the content of a local html file
// const data = fs.readFileSync('test.html', 'utf8')
const request = require('request');


request('https://chapmanganato.com/manga-aa951409/', function (error, response, body) {
    let content = body
    // console.log(content)

// console.log(content)

let html
html = content

const $ = cheerio.load(html);
const links = [];
const images = [];

//gets the chapters from the list
$('.panel-story-chapter-list a').each((index, element) => {
    links.push($(element).attr('href'));
});

//gets all of the image links form the page
$('.info-image img').each((index, element) => {
    images.push($(element).attr('src'));
});

console.log(links); // [ 'link1', 'link2' ]
console.log(images); // [ 'image1.jpg', 'image2.jpg' ]
this.images = images
});
