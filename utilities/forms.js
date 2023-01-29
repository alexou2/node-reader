let express = require('express');
let app = express();

//renders the form to add new chapters
app.get(`/new`, (req, res) => {
    res.render("../views/add-chapter");

});

app.listen(3000, (req, res) => {
    console.log("Connected on port:3000");
});