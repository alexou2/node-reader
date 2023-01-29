//doesn't work for now

const fs = require('fs');
const path = require('path');
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('https://chapmanganato.com/manga-jt987302/chapter-14');
    let imgElements = await driver.findElements(By.css('img'));
    let imgUrls = await Promise.all(imgElements.map(img => img.getAttribute('src')));
    let dirName = "chapmanganato.com/manga-jt987302/chapter-14";

    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }

    for (let i = 0; i < imgUrls.length; i++) {
        let imgUrl = imgUrls[i];
        let fileName = path.basename(imgUrl);
        let fullPath = path.join(dirName, fileName);

        let data = await driver.executeScript(`return (async () => {
            const response = await fetch('${imgUrl}', { method: 'GET' });
            return await response.arrayBuffer();
        })();`);

        fs.writeFileSync(fullPath, Buffer.from(data));
    }

  } finally {
    await driver.quit();
  }
})();
