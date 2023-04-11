
try {
  const puppeteer = require('puppeteer');
} catch {
  console.log('platform:', process.platform)
  if (process.platform == android) {
    console.log(`puppeteer is not supported on your device or isn't installed`)
  }
}

const fs = require('fs');
const parse = require('./parser')
const request = require('request');
const cheerio = require('cheerio');




module.exports = {
  download: function (chapterLink, chapterName, mangaName, sem, coverImage) {
    (async () => {
      console.log("started downloading", chapterLink)

      const browser = await puppeteer.launch();
      const page = await browser.newPage();



      //downloads the page 
      await page.goto(chapterLink, { waitUntil: 'load', timeout: 0 })


      // Get all the image elements on the page
      const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

      // removes the first and the last element(manganato logo and go home button)
      images.shift()
      images.pop()
      // console.log(images)

      // const folderName = `../manga/${mangaName}/Chapter_15`
      const folderName = `manga/${mangaName}/${chapterName}`



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



  },

  getCoverImage: function (coverImage, mangaName) {
    (async () => {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();


      //downloads the cover image
      await page.goto(coverImage, { waitUntil: 'load', timeout: 0 })


      // download the cover image
      const cover = await page.$$eval('img', imgs => imgs.map(img => img.src));


      const folderName = `manga/${mangaName}`


      //creates the directory for the cover
      if (!fs.existsSync(`manga/${mangaName}`)) {
        fs.mkdirSync(`manga/${mangaName}`)
      }

      console.log(cover)
      // Download each image
      const response = await page.goto(cover[0]);
      const buffer = await response.buffer();
      fs.writeFileSync(`${folderName}/cover.jpg`, buffer);


      await page.close()
      await browser.close();
      console.log(`${folderName} has finished downloading`)
    })();



  },




  getMangaLink: function (searchedManga) {
    request(searchedManga, function (error, response, body) {
      let content = body




      let html
      html = content
      console.log("getMangalink is running")
      $ = cheerio.load(html);


      //gets the link for the first manga to be returned by the search query
      let returnedManga = []

      console.log("\n\nstarted searching form matches\n\n");
      // (async () => {
      console.log("inside async");
      $('.panel-search-story h3 a').each((index, element) => {
        returnedManga.push($(element).attr('href'));

        console.log("in process of returning matches");

        // console.log("\n\n\n\nelement", element);
      });

      // console.log(matches)
      console.log("\n\nfinished searching form matches\n\n");


      console.log("returnedmanga", returnedManga);

      const call = (async () => {
        console.log('calling parser')
        parse.parse(returnedManga[0])
      })
      console.log(call)

      console.log('done!')
      return returnedManga[0]
    }
    )
  },

}