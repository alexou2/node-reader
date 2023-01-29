const puppeteer = require('puppeteer');
const fs = require('fs');


const mangaName = "testing";

//runs the download function
for (let number = 1; number < 15; number ++){
download(number)
}


//downloads the chapters
function download(number){
(async () => {


  

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    
    // await page.goto('https://chapmanganato.com/manga-jt987302/chapter-15');
    await page.goto(`https://chapmanganato.com/manga-jt987302/chapter-${number}`);


    

    // Get all the image elements on the page
    const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
    
    


    // const folderName = `../manga/${mangaName}/Chapter_15`
     const folderName = `../manga/${mangaName}/Chapter_${number}`
    


    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(`../manga/${mangaName}`)
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