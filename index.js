let express = require('express');
let app = express();
app.use("/manga", express.static('manga'))

// Set express as Node.js web application
// server framework.


// Set EJS as templating engine
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("../index", { path_to_image: '/manga/hori/Horimiya Chapter 6.5 Bonus Manga Myamura - Manganelo_files/' });
});

// Server setup
app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
});




//reads and prints files in the selected directory
var pageList = readFiles();
console.log(pageList)



//lists all files in directory
function readFiles() {
    var pageList = [];
    const testFolder = './manga/hori/Horimiya Chapter 6.5 Bonus Manga Myamura - Manganelo_files';
    const fs = require('fs');

    fs.readdirSync(testFolder).forEach(file => {
        pageList.push(file);

    });
    pageList = filterList(pageList)
    return pageList;
}


//filters the files givent to it and keeps only jpg files
function filterList(pageList) {
    var images = pageList.filter(function (p) {
        return (p.includes('.jpg'));
    });
    return (images)
}


linkImages(pageList)


//turns links to images into something that is usable by the html code with <img src>
function linkImages(pageList) {

    var images = []
    var i = 0;
    pageList.forEach(function (entry) {
        images[i] = `<img src = "${pageList[i]}">"`
        pageList[i] = images[i]

        i = i + 1;
    });
    console.log(pageList)
    return pageList
}