const puppeteer = require('puppeteer');
const fs = require('fs');


const mangaName = "testing";

const number = 16

//runs the download function for a set number of times
// for (let number = 1; number < 15; number ++){
download(number)
// }


//downloads the chapters
function download(number){
(async () => {
  

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    
    // await page.goto('https://chapmanganato.com/manga-jt987302/chapter-15');
    // await page.goto(`https://chapmanganato.com/manga-jt987302/chapter-${number}`);
    await page.goto('http://localhost:3000/manga/gal/The%20Gal%20Who%20Was%20Meant%20To%20Confess%20To%20Me%20As%20A%20Game%20Punishment%20Has%20Apparently%20Fallen%20In%20Love%20With%20Me%20Chapter%201%20-%20Manganelo_files/');


    

    // Get all the image elements on the page
    const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
    
    


    // const folderName = `../manga/${mangaName}/Chapter_15`
     const folderName = `../manga/${mangaName}/Chapter_${number}`
    


     if (!fs.existsSync(`../manga/${mangaName}`)) {
      fs.mkdirSync(`../manga/${mangaName}`)
     }


    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    
    // Download each image
    for (let i = 0; i < images.length; i++) {
        const response = await page.goto(images[i]);
        const buffer = await response.buffer();
        fs.writeFileSync(`${folderName}/image-${i}.jpg`, buffer);
    }

    await browser.close();
    console.log(`${folderName} has finished downloading`)
})();
}