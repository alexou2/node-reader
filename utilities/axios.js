const fs = require('fs')
const axios = require('axios')

const text = (fs.readFileSync('./test.txt', 'utf8'))
console.log(text);
const urlArray = text.split("\n");
urlArray.pop()
console.log(urlArray);



const downloadImage = async (url) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
      const imageName = url.split('/').pop();
      fs.writeFileSync(`./images/${imageName}`, response.data);
      console.log(`Image ${imageName} downloaded.`);
    } catch (error) {
      console.error(`Error downloading image from ${url}: ${error}`);
    }
  };
  
  (async () => {
    urlArray.forEach(async (url) => {
      await downloadImage(url);
    });
  })();
  




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