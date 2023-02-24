let express = require('express');
let app = express();

const bodyParser = require('body-parser')
const fs = require('fs');
var url = require('url');
const parse = require('./utilities/parser');
const mangadex = require('./utilities/mangadex')
const { JSHandle } = require('puppeteer');

const writeJson = require('./utilities/jsonWriter');
const jsonWriter = require('./utilities/jsonWriter');

app.use(bodyParser.json());


// Set EJS as templating engine
app.set('view engine', 'ejs');
//serve mangas and css
app.use("/manga", express.static('./manga'))
app.use(express.static('./ressources'))

//form to add chapters
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.urlencoded({ extended: true }));



// insures that the program won't crash because there is a folder or essential file missing
if (!fs.existsSync(`manga`)) {
    fs.mkdirSync(`manga`)
}
if (!fs.existsSync(`jsonFiles`)) {
    fs.mkdirSync(`jsonFiles`)
}
if (!fs.existsSync(`jsonFiles/mangaList.json`)) {
const baseMangaList = JSON.stringify({ list_of_mangas: [] }, 'null', 2)
fs.writeFileSync('jsonFiles/mangaList.json', (baseMangaList))
}



//loads the form
app.get(`/new/`, (req, res) => {
    res.render("../views/add-manga");
});






//prints the content of the form and redirects to the homepage 
app.post(`/new`, (req, res) => {

    console.log(req.body)
    console.log(req.body.baseOffset)

    try {
        switch (req.body.source) {

            //if mangadex is the source
            case 'Mangadex':
                mangadex.getMangaID(req.body.mangaName + ' ', req.body.translatedLanguages, parseInt(req.body.baseOffset))
                console.log('mangadex in ', req.body.translatedLanguages)
                break;

            // if manganato is the source
            case 'Manganato':
                parse.parse(req.body.mangaName)
                // parse.searchByName(req.body.mangaName)
                console.log(`manganato in ${req.body.translatedLanguages}`)
                break;

            //if no match is found
            default: console.log(`no valid matches were found for ${req.body.mangaList}`)
        }
    } catch {
        console.error('An error occured. Please check your connection with the site.')
        console.error('If you are downloading from manganato, check if the link you entered is valid and that you selected manganato as an option')
        console.error('If you are downloading from mangadex, please verify that there are chapters translated in the manga that you selected')
    }


    // redirects the user to the homepage after adding the manga
    res.redirect(`/`)
})







// loads the page where the chapters are read
app.get(`/manga/:mangaName/:chapName/`, (req, res) => {
    var mangaName = req.params.mangaName,
        chapName = req.params.chapName;

    //gets and sorts page list
    var pageList = getPages(mangaName, chapName);
    pageList = pageList.sort(function (a, b) { return a - b });
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
    console.log('list of of pages for this chapter: ', pageList)

    //sends the informations to the page used to render the chapters
    res.render("../views/index", { path_to_image: pageList, chapName: chapName, mangaName: mangaName, prevChapter: prevChapter, nextChapter: nextChapter });


});




// enables the server to be accessed via localhost 3000
app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
});



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
        return pageList;
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



    console.log(arr); // ["Comic Girls Vol.1 Chapter 0 - Manganelo_files", "Comic Girls Vol.1 Chapter 1 - Manganelo_files", "Comic Girls Chapter 2 - Manganelo_files", "[1-n]", "[2-n]", "[10-n]"]
    return arr
}






//renders the homepage accessible at localhost:3000

app.get(`/`, (req, res) => {
    let mangaName = "."
    let mangaList = getList(mangaName)

    res.render("../views/home", { mangaList: mangaList, mangaName: mangaName });
    console.log("homepage is running")
});


//renders the page where all of a manga's chapters are displayed

app.get(`/manga/:mangaName`, (req, res) => {
    var mangaName = getMangaName(url.parse(req.url).pathname)
    mangaName = decodeURIComponent(mangaName)

    var chapterList = getList(decodeURIComponent(mangaName))

    chapterList = sortList(chapterList, 'chapters')
    // console.log("chapterList ",chapterList)

    //rendres chapter-menu.ejs with the arguments
    res.render("../views/chapter-menu", { mangaName: mangaName, chapterList: chapterList });
    console.log(mangaName)
    console.log("chapter page is running")
    console.log('outputting')
    // writeJson.outputJson(mangaName)

    writeJson.checkJson();
});



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
        console.log(!p.includes('.ht'))
        return !p.includes(`.ht`);
    });

    return contentList;
}

//extracts the manga name by getting the url and then removing what is not part of the manga's name
function getMangaName(path) {
    var mangaName = path.toString().split("/");
    mangaName = mangaName[2]
    var message = ("reading:" + mangaName)
    mangaName = mangaName.replaceAll('%20', '\ ')
    console.log(path)
    console.log(message)
    return mangaName
}


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
    prevAndNext[0] = (chapterList[i - 1])
    prevAndNext[1] = (chapterList[i + 1])
    console.log(prevAndNext)

    return prevAndNext
}