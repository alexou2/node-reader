const paragraph = 'ch-1_p1 ch12 ch 2';
const regex = /(Ch.?.?.?.?.?.?\d+(\.\d)*.*)/ig;
let found = paragraph.match(regex);

console.log(found);


// found = JSON.stringify(found)
console.log(typeof(found))
console.log(found.length)


//let matches = found.split(' ')
// for (let i in found)
// consolee.log(found[0]+'\n')
// Expected output: Array ["T", "I"]