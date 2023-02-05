let express = require('express');
let app = express();

const bodyParser = require('body-parser')
const fs = require('fs');
var url = require('url');
const parse = require('./parser');
const { JSHandle } = require('puppeteer');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
//loads the form
app.get(`/`, (req, res) => {
    // res.render("../views/add-manga");
    res.render("../../views/add-manga");
});






app.use(express.urlencoded({ extended: true }));
//prints the content of the form and redirects to the homepage 
app.post(`/new`, (req, res) => {
    let mangaLink = req.body
    console.log(mangaLink)


    let formData = req.body.mangaList;  // Get the value of the "mangaList" field in the form
    let mangaString = formData.toString();  // Convert the value to a string
  
    console.log(mangaString);  // Output: the string value of the "mangaList" field
  
    



    
    
    
    
    

    
    
    // if (!mangaLink) {
    //     console.log("mangaList field is not present in the request body.");
    //     return res.status(400).send("Bad Request: mangaList field is missing.");
    // }
    //  parse.parse(mangaString)

    // let search = parse.getMangaLink(mangaString)
    // res.send(search);
    res.redirect(`/`)
})





app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
})