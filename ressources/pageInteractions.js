

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

// progress bar 



// function increaseProgress(progressNumber) {
//   let progress = document.querySelector('.progress-done');
//   progress.style.width = progressNumber + "%"
//   progress.innerHTML = progressNumber.toFixed(1) + '%'
// }

// window.onload = function () {
//   // function getProgress(){
//   let chapters = "<%- chapterList %>".length
//   let jsonChapters = "<%- chapterNumber %>".length

//   console.log()

//   console.log(chapters, jsonChapters)
//   // gets the size of the increments
//   let increment = (chapters / jsonChapters) * 100;
//   console.log('increment', increment)

//   let progressNumber = increment
//   increaseProgress(progressNumber)

// }