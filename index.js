let express = require('express');
let app = express();
app.use("/manga", express.static('manga'))
const fs = require('fs');

//renders the homepage
let home = require('./home.js')
home.renderHomepage()

// Set express as Node.js web application
// server framework.


// let mangaName = "hori"
// let chapName = "hori_chap_1"
// var pageList = getPages(mangaName, chapName);


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


let chapterList = getChapterList()
console.log(chapterList)
renderHomepage(chapterList)
function renderHomepage(chapterList) {
    app.get(`/`, (req, res) => {

        res.render("../home", { chapterList: chapterList, mangaName: "hori" });
        console.log(chapterList)
        console.log("home.js is running")


    });
}



//gets chapters from a manga
function getChapterList() {
    var chapterList = [];
    var mangaName = "hori"
    const testFolder = `./manga/${mangaName}/`;

    fs.readdirSync(testFolder).forEach(file => {
        chapterList.push(file);
    });
    console.log("home.js is running")
    // console.log(chapterList)
    return chapterList;
}

