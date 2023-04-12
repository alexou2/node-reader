const manganato = require('./utilities/parser');

console.log('---------------------------------------------------');
// (async () => {
    const searchLink = manganato.searchByName('three days of happiness')
    console.log(searchLink)

    const mangaLink = (manganato.getMangaLink(searchLink))
    console.log(mangaLink)
// })