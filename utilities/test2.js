// const mangadex = require('./mangadex')

// //calls the function
// mangadex.getMangaID('three days of happiness', 'en')// I only call this function because I can't return the value of mangaID


const axios = require('axios')
const fs = require('fs');
const baseUrl = 'https://uploads.mangadex.org';



// (async () => {
//     const resp = await axios({
//         method: 'GET',
//         url: `${baseUrl}/manga`,
//         maxContentLength: Infinity,
//         params: {
//             title: title,
//             "order[relevance]": "desc",
//         }

//     });
//     console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");



// })();
mangaName = "horimiya"
const folderPath = `manga/${mangaName}`
        fs.mkdirSync(folderPath, { recursive: true });

const mangaID = '6d0e8d89-9b15-4155-af91-896d0c1b476b';

(async () => {
    console.log("addasd")
    const resp = await axios({
        method: 'GET',
        // url: `${baseUrl}/manga/${mangaID}`,
        url: `https://api.mangadex.org/cover?limit=10&manga%5B%5D=6d0e8d89-9b15-4155-af91-896d0c1b476b&includes%5B%5D=manga`,
        // url: `https://api.mangadex.org/cover/${mangaID}`

        // maxContentLength: Infinity,
        // "includes[]": "cover_art"
    });


    console.log(resp.data.data.map(manga => manga.attributes.fileName))
    const cover_fileName = resp.data.data.map(manga => manga.attributes.fileName)


    const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}`
    console.log(coverLink)

    fs.writeFileSync(`${folderPath}/${cover_fileName}`, coverLink);
})()