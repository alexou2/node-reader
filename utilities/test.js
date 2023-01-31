let express = require('express');
let app = express();






app.set('view engine', 'ejs');

app.get(`/`, (req, res) => {
    res.render("../views/add-manga.ejs", {description: "desc", markdown: "mkd", title:"title"});
});
console.log(__dirname)

app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
})