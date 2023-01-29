const app = require("express")

//renders the form to add new chapters
app.get(`/new`, (req, res) => {
    var mangaName = req.params.mangaName,
        chapName = req.params.chapName;

    var pageList = getPages(mangaName, chapName);
    pageList = pageList.sort(function (a, b) { return a - b });
    console.log(pageList)

    pageList = sortList(pageList)

    res.render("../views/add-chapter", { path_to_image: pageList, chapName: chapName, mangaName: mangaName });


});