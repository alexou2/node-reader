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

    // res.render("../index", { path_to_image: displayPages(mangaName, chapName, pageList) });

    res.render("../index", { path_to_image: pageList });


});

// Server setup
app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
});


//does all of the formatting in order to display images instead of a blob of text
function displayPages(mangaName, chapName, pageList) {
    let link = ""

    pageList.forEach(function (entry, i) {
        link = link + `<img src = "/manga/${mangaName}/${chapName}/${pageList[i]}">\n`

    })
    return link
}

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




//renders navigation pages
let mangaList = renderHomepage()
console.log("manga list is ", mangaList)
renderChapterList(mangaList)



function renderHomepage() {
    let mangaName = "."
    let mangaList = getList(mangaName)

    app.get(`/`, (req, res) => {
        res.render("../home", { mangaList: mangaList, mangaName: mangaName });
        console.log("homepage is running")
    });
    return mangaList
}





function renderChapterList(mangaList) {

    app.get(`/manga/:mangaName`, (req, res) => {
        // var mangaName = mangaList[0]
        var mangaName = getMangaName(url.parse(req.url).pathname)

        // mangaName = getList(url.parse(req.url).pathname)
        // console.log(mangaName)

        var chapterList = getList(mangaName)

        res.render("../chapter-menu", { mangaName: mangaName, chapterList: chapterList });
        console.log(mangaName)
        console.log("chapter page is running")
    });
}



//gets chapters from a manga
function getList(mangaName) {
    var contentList = [];
    const testFolder = `./manga/${mangaName}/`;

    fs.readdirSync(testFolder).forEach(file => {
        contentList.push(file);
    });
    return contentList;
}


function getMangaName(path) {
    var mangaName = path.toString().split("/");
    mangaName = mangaName[2]
    var message = ("reading:" + mangaName)
    console.log(path)
    console.log(message)
    return mangaName
}
