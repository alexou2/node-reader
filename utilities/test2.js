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
        url: `https://api.mangadex.org/cover?limit=10&manga%5B%5D=6d0e8d89-9b15-4155-af91-896d0c1b476b&includes%5B%5D=manga`,        // url: `https://api.mangadex.org/cover/${mangaID}`

        maxContentLength: Infinity,
        // responseType:'arraybuffer'
    });


    console.log(resp.data.data.map(manga => manga.attributes.fileName))
    const cover_fileName = resp.data.data.map(manga => manga.attributes.fileName)


    const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}`
    console.log(coverLink)


saveFileFromUrl(coverLink)


    fs.writeFileSync(`${folderPath}/${cover_fileName}`, coverLink);

    console.log('contents: ',fs.readdirSync('./manga/horimiya'))
})()





async function saveFileFromUrl(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      await fs.promises.writeFile(folderPath, buffer);
      console.log('File has been saved!');
    } catch (err) {
      console.error(err);
    }
  }
  
  // Example usage:
  saveFileFromUrl('https://example.com/file.txt', 'path/to/save/file.txt');



function getPages(coverLink){



    //creates a folder for the manga
    const folderPath = `manga/${mangaName}`
    fs.mkdirSync(folderPath, { recursive: true });


    //downloads the pages in the correct folderw
    (async () => {
        // for (const page of coverLink) {
            try {
                const resp = await axios({
                    method: 'GET',
                    url: coverLink,
                    maxContentLength: Infinity,
                    responseType: 'arraybuffer'
                });

                // console.log(`${folderPath}/${page}`, resp.data)
                fs.writeFileSync(`${folderPath}/${page}`, resp.data);
                console.log('page downloaded')
            
            
            
            } catch {
                console.error('\x1b[91m%s\x1b[0m', `err downloading pages`)
            }
        // };

        // console.log(`Downloaded ${data.length} pages.`);



        // console.log("\x1b[33m%s\x1b[0m", "  finished ", chapterName, "\n")
        // sem.leave(1)
    })();
}