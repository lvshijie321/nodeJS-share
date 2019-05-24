const path = require('path')
const fs = require('fs')



module.exports = (filePath, emitter) => {
    // 方式一：events.EventEmitter
    fs.readFile(path.resolve(__dirname, '../config/mime.json'), (err, data) => {
        const mime = JSON.parse(data.toString())
        emitter.emit('onContentType', mime[path.extname(filePath)] || 'text/html')
    })
    
    // 方式二：回调方式异步获取文件内容
    // fs.readFile('./config/mime.json', (err, data) => {
    //     const mime = JSON.parse(data.toString())
    //     callback(mime[path.extname(filePath)] || 'text/html')
    // })

    // 方式二：同步获取文件内容
    //return JSON.parse(fs.readFileSync('./config/mime.json').toString())[path.extname(filePath)] || 'text/html'
}