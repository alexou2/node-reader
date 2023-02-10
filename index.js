let express = require('express');
let app = express();

const bodyParser = require('body-parser')
const fs = require('fs');
var url = require('url');
const parse = require('./utilities/parser');
const mangadex = require('./utilities/mangadex')
const { JSHandle } = require('puppeteer');

app.use(bodyParser.json());


// Set EJS as templating engine
app.set('view engine', 'ejs');
//serve mangas and css
app.use("/manga", express.static('./manga'))
app.use(express.static('./ressources'))

//form to add chapters
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.urlencoded({ extended: true }));



//loads the form
app.get(`/new/`, (req, res) => {
    res.render("../views/add-manga");
});






//prints the content of the form and redirects to the homepage 
app.post(`/new`, (req, res) => {
    let mangaLink = req.body
    console.log(mangaLink)


    let formData = req.body.mangaList;  // Get the value of the "mangaList" field in the form
    let mangaString = formData.toString();  // Convert the value to a string

    console.log(mangaString);  // Output: the string value of the "mangaList" field



    try {
        switch (req.body.source) {

            //if mangadex is the source
            case 'Mangadex': mangadex.getMangaID(req.body.mangaName, req.body.translatedLanguages)
                console.log('mangadex')
                break;

            // if manganato is the source
            case 'Manganato': parse.parse(mangaString)
                break;
            //if no match is found
            default: console.log(`no valid matches were found for ${req.body.mangaList}`)
        }
    } catch {
        console.error('An error occured. Please check your connection with the site.')
        console.error('If you are downloading from manganato, check if the link you entered is valid and that you selected manganato as an option')
        console.log('If you are downloading from mangadex, please verify that there are chapters translated in the manga that you selected')
    }






    //enables searching using only the name and not the url
    //currently on hold, since I am trying mangadex's download api

    let searchedManga = parse.searchByName(mangaString)
    console.log("manga name", searchedManga)

    mangaLink = parse.getMangaLink(searchedManga)
    console.log("parser feed ", mangaLink)

    parse.parse(mangaLink)



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
    pageList = sortList(pageList)


    //gets the chapter list in order to determine what is the next and previous chapter
    var chapterList = getList(mangaName)
    chapterList = sortList(chapterList)
    // console.log(chapterList)

    //gets the previpus chapter and the next chapter
    let prevAndNext = getNextAndPrev(chapterList, chapName)
    let prevChapter = prevAndNext[0]
    let nextChapter = prevAndNext[1]
    console.group(prevAndNext)
    console.log(pageList)
    res.render("../views/index", { path_to_image: pageList, chapName: chapName, mangaName: mangaName, prevChapter: prevChapter, nextChapter: nextChapter });


});




// Server setup
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

        fs.readdirSync(testFolder).forEach(file => {
            pageList.push(file);
        });

        return pageList;
    }


    //filters the files givent to it and keeps only jpg files
    function filterList(pageList) {
        var images = pageList.filter(function (p) {


            return ((p.includes('.jpg')) || (p.includes('.png')));
        });
        return (images)
    }

    return pageList
}

//sorts the lists with the number in them created by chatGPT ;)
function sortList(arr) {

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





    console.log(arr); // ["Comic Girls Vol.1 Chapter 0 - Manganelo_files", "Comic Girls Vol.1 Chapter 1 - Manganelo_files", "Comic Girls Chapter 2 - Manganelo_files", "[1-n]", "[2-n]", "[10-n]"]
    return arr
}


//calls the functions to render navigation pages
let mangaList = renderHomepage()
console.log("manga list is ", mangaList)



//renders the homepage accessible at localhost:3000
function renderHomepage() {
    let mangaName = "."
    let mangaList = getList(mangaName)

    app.get(`/`, (req, res) => {
        res.render("../views/home", { mangaList: mangaList, mangaName: mangaName });
        console.log("homepage is running")

        //restarts server when refreshing page
        // res.send('Refreshing the page');
    });
    return mangaList
}

//renders the page where all of a manga's chapters are displayed

app.get(`/manga/:mangaName`, (req, res) => {
    var mangaName = getMangaName(url.parse(req.url).pathname)

    var chapterList = getList(mangaName)

    chapterList = sortList(chapterList)
    // console.log("chapterList ",chapterList)

    //rendres chapter-menu.ejs with the arguments
    res.render("../views/chapter-menu", { mangaName: mangaName, chapterList: chapterList });
    console.log(mangaName)
    console.log("chapter page is running")
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