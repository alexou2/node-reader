let express = require('express');
let app = express();
app.set('view engine', 'ejs');
app.use("/", express.static('./'))
const fs = require('fs');

module.exports = {
    renderHomepage : function(){
// app.get(`/`, (req, res) => {

//     res.render("../home", { chapterList: getChapterList() });

// console.log("home.js is running")
// });




// //gets chapters from a manga
// function getChapterList(){
//         var pageList = [];
//         var mangaName = "hori"
//         const testFolder = `./manga/${mangaName}/`;

//         fs.readdirSync(testFolder).forEach(file => {
//             pageList.push(file);
//         });
//         console.log("home.js is running")
// console.log(pageList)
//         return pageList;
    }}

// };