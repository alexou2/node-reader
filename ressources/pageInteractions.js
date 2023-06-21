

// page interactions that run on the client side


// modifies the bookmark attribute of the chapter
function addBookmark(mangaName, chapter, value) {

  // when chapter is bookmarked
  if (value == "true") {
    document.getElementById(`bookmark-${chapter}`).innerHTML = `
  <img id ="bookmark-img" onclick="addBookmark(\`${mangaName}\`, \`${chapter}\`,'false')" src=" /images/red-bookmark.svg">
  `
  }

  // when chapter is un-bookmarked
  if (value == "false") {
    document.getElementById(`bookmark-${chapter}`).innerHTML = `
    <img id ="bookmark-img" onclick="addBookmark(\`${mangaName}\`, \`${chapter}\`,'true')" src=" /images/dark-bookmark.svg">
    `
  }
  console.log("bookmark icon changed");

  // sends data to server
  var data = {
    mangaName,
    chapter,
    value,
  };

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/bookmark-chap');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  console.log('data:', data);

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
}


function goFullscreen() {
  // document.getElementsByClassName("entire").requestFullscreen();

  var elem = document.documentElement;

  /* View in fullscreen */
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

  // exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}


function deleteManga(mangaName) {
  console.log('clicked')
  let confirmation = confirm("Do you really want to delete this manga?");

  console.log(confirmation)
  if (confirmation) {
    const xhr = new XMLHttpRequest();
    console.log('data:', mangaName);
    xhr.open('POST', `/deleteManga`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ "mangaName": mangaName }))
    // location.replace('/')
    console.log('redirect')
  } else {
    console.log(`${mangaName} won't be deleted`)
  }


  // location.replace('/')
}