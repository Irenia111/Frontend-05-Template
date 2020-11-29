const http = require('http')

http.createServer((request, response) => {
    let body = [];

    request.on('error', (err) => {
        // 请求错误，直接打印
        console.log(err)
    }).on('data', (chunk) => {
        console.log('data',chunk.toString())
        // 范例代码是 body.push(chunk.toString()) 这样会报错，因为body采用Buffer.concat，不接收字符串参数
        // 果然是这里的问题，不能把chunk转换成字符！！！
        body.push(chunk)
    }).on('end', () => {
        // console.log(body)
        body = Buffer.concat(body).toString();
        console.log('body:', body)
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end(' Helloe World\n')
    })
}).listen(9000)

console.log('server started')