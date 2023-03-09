

// page interactions that run on the client side


// adds a bookmark to the chapter
function addBookmark(mangaName, chapter, value) {


//   if (value == "true") {

//     document.getElementById(`bookmark ${chapter}`).innerHTML = `
// // <img src=" /red-bookmark.svg">
// <img  onclick="addBookmark('<%= mangaName %>', '<%=chapterList[i]%>','false')" src=" /red-bookmark.svg">
// `
//   }


if (value == "true") {
  console.log('get fucked')
  document.getElementById(`bookmark ${chapter}`).innerHTML = `
  <img  onclick="addBookmark('${mangaName}', '${chapter}','false')" src=" /red-bookmark.svg">
  `
}

  if (value == "false") {
    console.log('get fucked')
    document.getElementById(`bookmark ${chapter}`).innerHTML = `
    <img  onclick="addBookmark('${mangaName}', '${chapter}','true')" src=" /blank-bookmark.svg">
    `
  }
  console.log("text changed")

  var data = {
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
function updateChapters(mangaName) {
  console.log("fuck off")
}

