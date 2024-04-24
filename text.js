const fs = require('fs');
const readStream = fs.createReadStream('./blog.txt',{encoding:'utf8'})
const writeStream = fs.createWriteStream('./blog1.txt')
// readStream.on('data',(chunk)=>{
//     console.log('-----------NEW CHUNK-----------')
//     console.log(chunk.toString())
//     writeStream.write('\n-----------NEW CHUNK-----------\n')
//     writeStream.write(chunk)
// })

readStream.pipe(writeStream);