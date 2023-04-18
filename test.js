const fs = require('fs')

try{
fs.mkdirSync('testrm')
}catch{}

try{
fs.writeFileSync('testrm/t.l', 'tl')
}catch{}

// try{
fs.rmSync('testrm', ({ recursive: true }))
// }catch{}
console.log(fs.existsSync('testrm'))