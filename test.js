const jsonWriter = require('./utilities/jsonWriter');

// const paragraph = 'ch-1_p1 ch12 ch 2';
const data = jsonWriter.getMangaJson('Kishuku Gakkou no Juliet');

let paragraph = data.chapters.map(path => path.chapterPath);

console.log('type:', typeof (data))

let tags = data.tags;
let mangaDesc = data.description;
 paragraph = data.chapters.map(name => name.chapterPath);
let bookmarks = data.chapters.map(book => book.bookmarked);

const regex = /(Ch.?.?.?.?.?.?.?\d+(\.\d)*.*)/ig;
// const regex = /Chapter\s*(\d+(?:\.\d+)?)/i;

console.log('para:',paragraph);
let found = []
for (i in paragraph){
found.push(paragraph[i].match(regex))
console.log('matches:',paragraph[i].match(regex))

}
console.log(found);


// found = JSON.stringify(found)
console.log(typeof(found))
console.log(found.length)


//let matches = found.split(' ')
// for (let i in found)
// consolee.log(found[0]+'\n')
// Expected output: Array ["T", "I"]