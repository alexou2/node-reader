let express = require('express');
let app = express();

const bodyParser = require('body-parser')
const fs = require('fs');
const form = require('./utilities/formsManager')

const writeJson = require('./utilities/jsonWriter');
const jsonWriter = require('./utilities/jsonWriter');
const mangadex = require('./utilities/mangadex');
const argsManager = require('./utilities/argsManager');

app.use(bodyParser.json());


// Set EJS as templating engine
app.set('view engine', 'ejs');
//serve mangas and css
app.use("/manga", express.static('./manga'))
app.use(express.static('./ressources'))
app.use(express.static('./testFiles'))

//form to add chapters
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.urlencoded({ extended: true }));



// insures that the program won't crash because there is a folder or essential file missing
// creates the manga directory if it doesn't exist
if (!fs.existsSync(`manga`)) {
    fs.mkdirSync(`manga`)
}
// creates the diretcory for json files
if (!fs.existsSync(`jsonFiles`)) {
    fs.mkdirSync(`jsonFiles`)
}



// gets the arguments




// testing xhr request for autocomplete
app.get('/test/complete', (req, res) => {
    res.render('complete.ejs');
})

app.get('/test/:mid', async (req, res) => {
    var mid = req.params.mid;

    // const manga = await axios('https://api.mangadex.org/manga/' + mid+" ").then(t => t.data);
    mid = await (mangadex.autocomplete(mid))

    console.log('autocomplete:', mid)
    res.json(mid);
});


// //loads the form
// app.get(`/new/`, (req, res) => {
//     res.render("../views/add-manga");
// });



//renders the homepage accessible at localhost:3000
app.get(`/`, (req, res) => {
    let mangaName = "."
    let mangaList = getList(mangaName)
    for (i in mangaList) {
        mangaList[i] = mangaList[i].replaceAll('%', '%25')
    }
    res.render("../views/home", { mangaList: mangaList, mangaName: mangaName });
    console.log("homepage is running")
});



//renders the page where all of a manga's chapters are displayed
app.get(`/manga/:mangaName`, (req, res) => {
    // var mangaName = getMangaName(url.parse(req.url).pathname)
    var mangaName = req.params.mangaName;


    mangaName = mangaName.replaceAll('%20', '\ ')
    var chapterList = getList(mangaName)

    // var chapterList = getList(mangaName)
    writeJson.checkJson(mangaName);

    chapterList = sortList(chapterList, 'chapters')
    // console.log("chapterList ",chapterList)

    // let mangaDesc = writeJson.getMangaDesc(mangaName)
    // console.log('desc', mangaDesc);

    for (i in chapterList) {
        chapterList[i] = chapterList[i].replaceAll('%', '%25')
    }
    chapterList.pop()

    // getting informations from json file
    let data = jsonWriter.getMangaJson(mangaName, chapterList);


    let tags = data.tags;
    let mangaDesc = data.description;
    let chapterName = data.chapters.map(name => name.chapterName);
    let bookmarks = data.chapters.map(book => book.bookmarked);

    // will cause problems!!!
    // chapterList = data.chapters.map(chapter => chapter.chapterPath) //remove this line if some chapters can't be accessed

    // let bookmarks = jsonWriter.getBookmarks(mangaName)

    // console.log(data)
    console.log(chapterName)


    //renders the chapter-menu.ejs with the arguments
    res.render("../views/chapter-menu", { mangaName: mangaName, chapterList: chapterList, mangaDesc: mangaDesc, bookmarks: bookmarks, chapterName: chapterName, tags: tags });
    // res.render("../views/chapter-menu", { mangaName: mangaName, chapterList: chapterList, mangaDesc: mangaDesc, bookmarks: bookmarks, chapterName: chapterList, tags: tags });
});


// loads the page where the chapters are read
app.get(`/manga/:mangaName/:chapName/`, (req, res) => {
    console.log
    let mangaName = req.params.mangaName,
        chapName = req.params.chapName;


    // writeJson.setBookmark(mangaName, chapName, 'true')
    // writeJson.getBookmark(mangaName)




    console.log('chap name: ', chapName)


    // potential issue
    // chapName = decodeURIComponent(chapName)

    // if (chapName.contains('%25')){
    chapName = chapName.replaceAll('%', '%25')
    console.log(chapName)
    // }


    //gets and sorts page list
    let pageList = getPages(mangaName, chapName);
    // pageList = pageList.sort(function (a, b) { return a - b });
    pageList = sortList(pageList, 'pages')


    //gets the chapter list in order to determine what is the next and previous chapter
    var chapterList = getList(mangaName)
    chapterList = sortList(chapterList, 'chapters')
    // console.log(chapterList)

    //gets the previpus chapter and the next chapter
    let prevAndNext = getNextAndPrev(chapterList, chapName)
    let prevChapter = prevAndNext[0]
    let nextChapter = prevAndNext[1]
    console.group(prevAndNext)

    mangaName = mangaName.replaceAll('%', '%25')



    //sends the informations to the page used to render the chapters
    res.render("../views/index", { path_to_image: pageList, chapName: chapName, mangaName: mangaName, prevChapter: prevChapter, nextChapter: nextChapter });
});


//prints the content of the form and redirects to the homepage 
app.post(`/new`, (req, res) => {

    console.log(req.body)
    console.log(req.body.baseOffset)

    form.downloadManga(req)

    // redirects the user to the homepage after adding the manga
    res.redirect(`/`)
})

// post request for bookmarking chapters
app.post(`/bookmark-chap`, (req, res) => {

    // let mangaName = req.params.mangaName
    // console.log('data: ', req)
    form.bookmarkChap(req)
    console.log(req)
    // console.log(req.body.updateJson)
    res.sendStatus(200)
})

// post request when updating chapter list from html page
app.post(`/update-chapters`, (req, res) => {

    // let mangaName = req.params.mangaName
    // console.log('data: ', req)
    form.updateChapterList(req)
    // redirects with status code 200 (ok)
    res.sendStatus(200)
})

// post request when adding a new manga
app.post(`/`, (req, res) => {
    console.log('req', req)
    console.log(req.body)
    console.log(req.body.baseOffset)

    // calls the form manager to take care of the request
    form.downloadManga(req)
    // res.redirect(`.`)
    res.sendStatus(200)
})

// uses arguments to see if user wants lan access
let lanAccess = argsManager.getArgs(process.argv)

// enables the server to be accessed via localhost 3000
if (process.platform != 'win32' && process.platform != 'linux' && lanAccess) {
    app.listen(3000, (req, res) => {
        console.log("Connected on port:3000");
    });
} else {
    // if the pc is running a distro of linux or windows
    const PORT = 3000;
    const LAN_IP_ADDRESS = 'hordeprix' // this is the name of the computer on the network 

    app.listen(PORT, LAN_IP_ADDRESS, () => {
        console.log(`Server running at http://${LAN_IP_ADDRESS}:${PORT}/`);
    });
}



//gets all of the pages in the selectrd directory
function getPages(mangaName, chapName) {
    var pageList = readFiles();
    pageList = filterList(pageList)

    //lists all files for a chapter
    function readFiles() {
        var pageList = [];
        const testFolder = `./manga/${mangaName}/${chapName}`;
        // reads the files in the folder and returns its contents
        fs.readdirSync(testFolder).forEach(file => {
            pageList.push(file);
        });
        // return pageList;
        // pageList = ((pageList.includes('.jpg')) || (pageList.includes('.png')))
        // console.log('page list:',pageList)
        return pageList
    }


    //filters the files givent to it and keeps only jpg files
    function filterList(pageList) {
        var images = pageList.filter(function (p) {
            //returns only the images
            return ((p.includes('.jpg')) || (p.includes('.png')));
        });
        return (images)
    }

    return pageList
}

//sorts the lists with the number in them created by chatGPT ;)
function sortList(arr, type) {


    // if the array to sort is pages
    if (type == 'pages') {
        const regex = /\d+/;

        arr.sort((a, b) => {
            const aMatch = a.match(regex);
            const bMatch = b.match(regex);
            if (!aMatch && !bMatch) {
                return a.localeCompare(b);
            } else if (!aMatch) {
                return 1;
            } else if (!bMatch) {
                return -1;
            } else {
                const aNum = parseInt(aMatch[0]);
                const bNum = parseInt(bMatch[0]);
                return aNum - bNum;
            } title
        });

    }
    else {
        // sorting chapters
        const regex = /Chapter\s*(\d+(?:\.\d+)?)/i;

        arr.sort((a, b) => {
            const aMatch = a.match(regex);
            const bMatch = b.match(regex);
            if (!aMatch && !bMatch) {
                return a.localeCompare(b);
            } else if (!aMatch) {
                return 1;
            } else if (!bMatch) {
                return -1;
            } else {
                const aNum = parseFloat(aMatch[1]);
                const bNum = parseFloat(bMatch[1]);
                if (aNum === bNum) {
                    return arr.indexOf(a) - arr.indexOf(b);
                } else {
                    return aNum - bNum;
                }
            }
        });

    }



    // console.log(arr);
    return arr
}



//gets chapters from a manga
function getList(mangaName) {
    var contentList = [];
    const testFolder = `./manga/${mangaName}/`;

    //gets file from the folder
    fs.readdirSync(testFolder).forEach(file => {
        contentList.push(file);
    });
    // console.log("content list: ", contentList)

    //removes all elements that contains ".ht" in them
    contentList = contentList.filter(function (p) {
        // console.log(!p.includes('.ht'))
        return !p.includes(`.ht`);
    });

    return contentList;
}

// finds the previous chapter and the next chapter
function getNextAndPrev(chapterList, currentChapter) {
    let prevChapter
    let nextChapter
    //the first value is the 
    let prevAndNext = []

    //find where the current chapter is in the list and returns i
    for (var i = 0; i < chapterList.length; i++) {
        if (chapterList[i] == currentChapter) {
            break
        }
    }
    // replaces the % in the url by %25 to avoid URI decoding errors
    try {
        prevAndNext[1] = (chapterList[i + 1]).replace('%', '%25')
        prevAndNext[0] = (chapterList[i - 1]).replace('%', '%25')
    } catch {
        console.error('first chap')
    }
    console.log(prevAndNext)

    return prevAndNext
}
module.exports = { sortList }