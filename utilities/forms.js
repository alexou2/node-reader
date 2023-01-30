let express = require('express');
let app = express();


module.exports = {
add: function () {

//renders the form to add new chapters
app.set('view engine', 'ejs');

app.get(`/new/`, (req, res) => {
    res.render("../../views/add-manga");
});
console.log(__dirname)

// app.listen(3000, (req, res) => {
//     console.log("Connected on port:3000");
// });

    }
}
