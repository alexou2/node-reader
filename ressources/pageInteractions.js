

// page interactions that run on the client side


// modifies the bookmark attribute of the chapter
function addBookmark(mangaName, chapter, value) {
console.log(mangaName, chapter, value)

  // when chapter is bookmarked
  if (value == "true") {
    console.log('get fucked')
    document.getElementById(`bookmark-${chapter}`).innerHTML = `
  <img id ="bookmark-img" onclick="addBookmark(\`${mangaName}\`, \`${chapter}\`,'false')" src=" /red-bookmark.svg">
  `
  }

  // when chapter is un-bookmarked
  if (value == "false") {
    console.log('get un-fucked')
    document.getElementById(`bookmark-${chapter}`).innerHTML = `
    <img id ="bookmark-img" onclick="addBookmark(\`${mangaName}\`, \`${chapter}\`,'true')" src=" /dark-bookmark.svg">
    `
  }
  console.log("text changed")

  // sends data to server
  var data = {
    mangaName,
    chapter,
    value,
  };
  console.log(data)

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/bookmark-chap');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  console.log(data)

}


// saves the progress in the manga to resube later
function followProgress(mangaName, chapter) {

}

// when the button is clicked, it will download the newest chapters for the manga
function updateChapters(mangaName, offset) {
  console.log(mangaName)
  console.log(offset)


  // sends data to server
  var data = {
    mangaName,
    offset,
  };
  console.log(data)

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/update-chapters');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  console.log(data)


  console.log("fuck off")
}

