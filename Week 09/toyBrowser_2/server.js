const http = require('http')

http.createServer((request, response) => {
    console.log('request received')
    console.log(request.headers)
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
        response.end(
`<html lang='en'>
<head>
    <style>
        body div #myid{
            width: 100px;
            background-color: #ff5000;
        }
        body div img{
            width: 30px;
            background-color: #ff1111;
        }
    </style>
</head>
<body>
    <div>
        <img id='myid' />
        <img />
    </div>
</body>
</html>`)
    })
}).listen(9000)

console.log('server started')