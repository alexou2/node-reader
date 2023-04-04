// parses and returns the data needed for each chapter

function getProgressStatus(chapterList, mangaJson) {
    // will display a progress bar based on the % of chapters downoaded vs the number of chapters in the json
    // will send a notification to the pwa when the chapters have finished downloading
}

function filterJson(chapterList, mangaJson) {















  // reads the json file and extracts the list of chapters
  mangaJson = JSON.parse(mangaJson, 'utf-8');
  let chapterPath = mangaJson.chapters.map(path => path.chapterPath)

  console.log(chapterPath)
  let elementsToDelete = []


  // searches for each chapter
  for (let i in chapterPath) {

      // finds the chapter number 
      let chapterNumber = chapterPath[i].split(' ')[1]

      // finds each chapter's name
      let name = chapterPath[i].replaceAll(/Chapter.?.?.?\d*(\.[1-9])?/ig, '')
      name = name.replaceAll('_', '')
      name = name.replaceAll(':', '')
      name = name.trim()


      let regex = new RegExp(`Ch.?.?.?.?.?.?.?.?${chapterNumber}.*${name}.*`, "ig")



      // tries to match chapters in the json file to a downloaded chapter
      let match = chapterList.some(chapter => regex.test(chapter));
      if (!match) {
          // console.log(match)
          elementsToDelete.push(i)
          // console.log('push', jsonData.chapters[i])
      }

  }


  // deletes the extra chapters in the json object
  if (elementsToDelete.length > 0) {
      for (let j in elementsToDelete) {
          // deletes the elements to delete
          mangaJson.chapters.splice(([elementsToDelete[j]] - j), 1);
      }
  }













    return mangaJson;
}

// returns the bookmarks of the downloaded chapters
function getBookmarks(mangaJson) {
    let bookmarks = mangaJson.chapters.map(book => book.bookmarked);
    console.log(bookmarks);

    return bookmarks;
}

function getChapterName(mangaJson) {
    let chapterName = mangaJson.chapters.map(chapter => chapter.chapterName);
    console.log(chapterName);

    return chapterName;
}

function getMangaDescription(mangaJson){
    let description = mangaJson.description;
    console.log(chapterName);

    return description;
}

function getMangaTags(mangaJson){
    let tags = mangaJson.tags;
    console.log(tags);

    return tags;
}

function getMangaName(mangaJson){
    let mangaName = mangaJson.mangaName;
    console.log(mangaName);

    return mangaName;
}