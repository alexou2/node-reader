

// page interactions that run on the client side


// adds a bookmark to the chapter
function addBookmark(mangaName, chapter, value) {
document.getElementById(`bookmark ${chapter}`).innerHTML = `
<img class="bookmark"src=" /red-bookmark.svg">
`
console.log("text changed")

    const data = {
        mangaName,
        chapter,
        value,
      };
      
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/send-data');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      console.log(data)
      
}

// removes the bookmark
function removeBookmark(mangaName, chapter) {

}

// finds which chapter is bokmarked and returns it as a list
function getBookmark(mangaName) {

}

// saves the progress in the manga to resube later
function followProgress(mangaName, chapter) {

}
// when the button is clicked, it will download the newest chapters for the manga
function updateMangaChaps(mangaName) {

}

