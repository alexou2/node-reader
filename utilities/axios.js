// const fs = require('fs')
// const axios = require('axios')

// const text = (fs.readFileSync('./test.txt', 'utf8'))
// console.log(text);
// const urlArray = text.split("\n");
// urlArray.pop()
// console.log(urlArray);



// const downloadImage = async (url) => {
//     try {
//       const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
//       const imageName = url.split('/').pop();
//       fs.writeFileSync(`./images/${imageName}`, response.data);
//       console.log(`Image ${imageName} downloaded.`);
//     } catch (error) {
//       console.error(`Error downloading image from ${url}: ${error}`);
//     }
//   };
  
//   (async () => {
//     urlArray.forEach(async (url) => {
//       await downloadImage(url);
//     });
//   })();
  




// (async () => {
//     let i = 0
//     for (const page of text) {
//         const resp = await axios({
//             maxContentLength: '200000',
//             setMaxListeners: 20000,
//             method: 'GET',
//             url: buffer[i],
//             responseType: 'arraybuffer',

//         });
//         console.log(maxContentLength)
//         fs.writeFileSync(`chapter1/${page}`, resp.data);
//         i++
//     };

//     console.log(`Downloaded ${data.length} pages.`);
// })();




const axios = require('axios');
const https = require('https');
const fs = require('fs');

const mangaName = "horimiya";
// const folderPath = `./manga/${mangaName}`;
// fs.mkdirSync(folderPath, { recursive: true });

// const mangaID = '6d0e8d89-9b15-4155-af91-896d0c1b476b';

// (async () => {
//   const resp = await axios({
//     method: 'GET',
//     url: `https://api.mangadex.org/cover?limit=10&manga%5B%5D=6d0e8d89-9b15-4155-af91-896d0c1b476b&includes%5B%5D=manga`,
//     maxContentLength: Infinity,
//   });

//   const cover_fileName = resp.data.data.map(manga => manga.attributes.fileName);
//   const coverLink = `https://uploads.mangadex.org/covers/${mangaID}/${cover_fileName}`;

//   const file = fs.createWriteStream(`${folderPath}/${cover_fileName}`);
//   https.get(coverLink, function(response) {
//     response.pipe(file);
//   });

//   console.log(`Downloaded file: ${cover_fileName}`);

//   console.log(`Contents: ${fs.readdirSync(folderPath)}`);
// })();



const baseUrl = 'https://api.mangadex.org'
let title = 'gimai seikatsu ';
let languages= "en";

(async () => {
  const resp = await axios({
      method: 'GET',
      url: `${baseUrl}/manga`,
      maxContentLength: Infinity,
      params: {
          title: title,
          "order[relevance]": "desc",
      }

  });
  console.log("\n\nList of manga corresponding to the search: \n", resp.data.data.map(manga => manga.id), "\n");


  var mangaID = resp.data.data.map(manga => manga.id)

  let contentRating = resp.data.data.map(rating => rating.attributes.contentRating)
  console.log(contentRating)
  
  let tags = resp.data.data.map(rating => rating.attributes.contentRating)
  console.log(tgs)



  // let coverImage = `https://uploads.mangadex.org/covers/${mangaID}/${ma}.png.512.jpg`


  // returns only the first manga returned for simplicity purposes.I might change this later, or I might just forget about is :)
})();