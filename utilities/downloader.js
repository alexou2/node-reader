const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://chapmanganato.com/manga-jt987302/chapter-15');

    // Get all the image elements on the page
    const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
    const folderName = 'Chapter_15'
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
})();
