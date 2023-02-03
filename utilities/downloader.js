const puppeteer = require('puppeteer');
const fs = require('fs');
// let sem = requimangaNamere('semaphore')(10)



module.exports = {
  download: function (chapterLink, number, mangaName, sem) {
    (async () => {
      console.log("started downloading", chapterLink)

      const browser = await puppeteer.launch();
      const page = await browser.newPage();



      //downloads the page 
      await page.goto(chapterLink, { waitUntil: 'load', timeout: 0 })



      // Get all the image elements on the page
      const images = await page.$$eval('img', imgs => imgs.map(img => img.src));


      images.shift()
      images.pop()
      console.log(images)

      // const folderName = `../manga/${mangaName}/Chapter_15`
      const folderName = `manga/${mangaName}/Chapter_${number + 1}`



      if (!fs.existsSync(`manga/${mangaName}`)) {
        fs.mkdirSync(`manga/${mangaName}`)
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

      await page.close()
      await browser.close();
      console.log(`${folderName} has finished downloading`)
      sem.leave(1)
    })();
  }

}