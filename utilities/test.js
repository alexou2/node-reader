// let express = require('express');
// let app = express();

// const bodyParser = require('body-parser')
// const fs = require('fs');
// var url = require('url');
// const parse = require('./parser');
// const { JSHandle } = require('puppeteer');
// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: false }))
// app.set('view engine', 'ejs');
// //loads the form
// app.get(`/`, (req, res) => {
//     // res.render("../views/add-manga");
//     res.render("../views/add-manga");
// });






// app.use(express.urlencoded({ extended: true }));
// //prints the content of the form and redirects to the homepage 
// app.post(`/new`, (req, res) => {
//     // let mangaLink = req.body
//     // console.log(mangaLink)


//     // let formData = req.body.mangaList;  // Get the value of the "mangaList" field in the form
//     // let mangaString = formData.toString();  // Convert the value to a string

//     // console.log(mangaString);  // Output: the string value of the "mangaList" field






//     const fs = require('fs');

// const folderName = "folder!with?special^characters";
// const hexFolderName = Array.from(folderName).map(c => c.charCodeAt(0).toString(16)).join('');

// fs.mkdirSync(hexFolderName);


// console.log(hexFolderName)







//     // if (!mangaLink) {
//     //     console.log("mangaList field is not present in the request body.");
//     //     return res.status(400).send("Bad Request: mangaList field is missing.");
//     // }
//     //  parse.parse(mangaString)

//     // let search = parse.getMangaLink(mangaString)
//     // res.send(search);
//     res.redirect(`/`)
// })





// app.listen(3000, (req, res) => {
//     console.log("Connected on port:3000");
// })


// const findCurrentChapter = (chapterList, currentChapter) => {
//     return new Promise((resolve, reject) => {
//       for (let i in chapterList) {
//         if (chapterList[i] === currentChapter) {
//           resolve(i);
//           break;
//         }
//       }
//       reject(`Chapter ${currentChapter} not found in chapterList`);
//     });
//   };

//   findCurrentChapter(['Chapter 1', 'Chapter 2', 'Chapter 3'], 'Chapter 2')
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.error(err);
//     });


let parse = require('./parser')

let mangaString = 'horimiya'


// let searchedManga = parse.searchByName(mangaString)
// console.log("manga name", searchedManga)

// mangaLink = parse.getMangaLink(searchedManga)
// console.log("parser feed ", mangaLink)



// function getSumNum(a, b, mangaLink, mangaString) {
//     const customPromise = new Promise((resolve, reject) => {
//         const sum = a + b;

//         if (sum <= 5) {
//             resolve("Let's go!!",
//                 parse.parse(mangaLink)
//             )
//         } else {
//             reject(new Error('Oops!.. Number must be less than 5'))
//         }
//     })

//     return customPromise
// }
// let sum = getSumNum(1, 1)
// console.log(sum)




const getMangaLink = async (mangaString) =>{


    console.log(mangaString)
    
    
    let searchedManga = await parse.searchByName(mangaString)
    console.log("manga name", searchedManga)

    let mangaLink = parse.getMangaLink(searchedManga)
    console.log("parser feed ", mangaLink)

    parse.parse(mangaLink)

}
getMangaLink(mangaString)






