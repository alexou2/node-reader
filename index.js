let express = require('express');
let app = express();
app.use("/manga", express.static('./manga'))
app.use(express.static('./ressources'))

const fs = require('fs');
var url = require('url');

//renders the homepage
let home = require('./home.js')
home.renderHomepage()

// Set express as Node.js web application
// server framework.


// Set EJS as templating engine
app.set('view engine', 'ejs');

app.get(`/manga/:mangaName/:chapName/`, (req, res) => {
    var mangaName = req.params.mangaName,
        chapName = req.params.chapName;

    var pageList = getPages(mangaName, chapName);
    pageList = pageList.sort(function (a, b) { return a - b });
    console.log(pageList)

    // res.render("../index", { path_to_image: displayPages(mangaName, chapName, pageList) });

    pageList = sortList(pageList)

    res.render("../views/index", { path_to_image: pageList, chapName: chapName, mangaName: mangaName });


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
            return (p.includes('.jpg'));
        });
        return (images)
    }

    return pageList
}

//sorts the lists with the number in them created by chatGPT ;)
function sortList(arr) {
    arr.sort((a, b) => {
        let a_parts = a.split(" ");
        let b_parts = b.split(" ");
        let a_num = parseInt(a_parts[a_parts.length - 3]) || parseInt(a.match(/\d+/)[0]);
        let b_num = parseInt(b_parts[b_parts.length - 3]) || parseInt(b.match(/\d+/)[0]);
        return a_num === 0 ? -1 : b_num === 0 ? 1 : a_num - b_num;
    });
    console.log(arr); // ["Comic Girls Vol.1 Chapter 0 - Manganelo_files", "Comic Girls Vol.1 Chapter 1 - Manganelo_files", "Comic Girls Chapter 2 - Manganelo_files", "[1-n]", "[2-n]", "[10-n]"]
    return arr
}


//calls the functions to render navigation pages
let mangaList = renderHomepage()
console.log("manga list is ", mangaList)
renderChapterList(mangaList)


//renders the homepage accessible at localhost:3000
function renderHomepage() {
    let mangaName = "."
    let mangaList = getList(mangaName)

    app.get(`/`, (req, res) => {
        res.render("../views/home", { mangaList: mangaList, mangaName: mangaName });
        console.log("homepage is running")
    });
    return mangaList
}

//renders the page where all of a manga's chapters are displayed
function renderChapterList(mangaList) {

    app.get(`/manga/:mangaName`, (req, res) => {
        var mangaName = getMangaName(url.parse(req.url).pathname)

        var chapterList = getList(mangaName)

        chapterList = sortList(chapterList)
        console.log(chapterList)

        //rendres chapter-menu.ejs with the arguments
        res.render("../views/chapter-menu", { mangaName: mangaName, chapterList: chapterList });
        console.log(mangaName)
        console.log("chapter page is running")
    });
}



//gets chapters from a manga
function getList(mangaName) {
    var contentList = [];
    const testFolder = `./manga/${mangaName}/`;

    //gets file from the folder
    fs.readdirSync(testFolder).forEach(file => {
        contentList.push(file);
    });
    console.log("content list: ", contentList)

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
