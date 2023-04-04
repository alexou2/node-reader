// parses and returns the data needed for each chapter

function getProgressStatus(chapterList, mangaJson) {
    // will display a progress bar based on the % of chapters downoaded vs the number of chapters in the json
    // will send a notification to the pwa when the chapters have finished downloading
}

function filterJson(chapterList, mangaJson) {

}

// returns the bookmarks of the downloaded chapters
function getBookmarks(mangaJson) {
    let bookmarks = mangaJson.chapters.map(book => book.bookmarked);
    console.log(bookmarks);

    return bookmarks;
}

function getChapterName(mangaJson) {
    let bookmarks = mangaJson.chapters.map(book => book.bookmarked);
    console.log(bookmarks);

    return bookmarks;
}

function getMangaTags(mangaJson){

}

function getMangaDesc(mangaJson){

}

function getMangaName(mangaJson) {

}