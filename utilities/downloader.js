const puppeteer = require('puppeteer');
const fs = require('fs');







//splits the number of chapter in chunks of 9 chapters to fix memory leak issues


//number of chapters you want to download (I recommend downloading by chunks of 10 chapters to avoid memory leak)
const chapterNumber = 10
//the name of the folder will have this name
const mangaName = "one piece"
// the manganato link for the chapters (remove the chapter number from the url)
const chapterLink = "https://chapmanganato.com/manga-aa951409/chapter-"
// if you have more than 9 chapters to download, change this variable, otherwise, don't
const minChap = 1


//runs the download function for a set number of times
for (let number = minChap; number <= chapterNumber; number ++){
download(number)
console.log(`started chapter ${number}`)
}


//downloads the chapters
function download(number){
(async () => {
  

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    
    // await page.goto('https://chapmanganato.com/manga-jt987302/chapter-15');
    

    // await page.goto(`https://chapmanganato.com/manga-aa951409/chapter-${number}`, {waitUntil: 'load', timeout: 0});
   
   //downloads the page 
    await page.goto(`${chapterLink}${number}`, {waitUntil: 'load', timeout: 0});


    

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

    await page.close()
    await browser.close();
    console.log(`${folderName} has finished downloading`)
})();
}