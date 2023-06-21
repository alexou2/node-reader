const filter = require('./utilities/mangadex')


var mangaName = ['ch1', 'ch2', 'ch1', 'ch3', 'ch1', 'ch3', 'ch1']
var chapterID = ['id1', 'id2', 'id1+', 'id3', 'id1-','id3', 'id1-']

var [mangaName, chapterID] = filter.filterArr(mangaName, chapterID)

// console.log(mangaName, chapterID)

// let val1 = "var"
// let val2 = "val"

// let retVal1
// let retVal2

// [retVal1, retVal2] = ret(val1, val2)
// console.log(retVal1)
// console.log(retVal2)


// function ret(var1, var2){
//     var1 = var1+"?";
//     var2 = var2+"?";
    
//     return [var1, var2]
// }