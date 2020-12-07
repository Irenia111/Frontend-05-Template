const net = require('net')
// 引入parser
const parser = require('./parser')


class Request {
    // 在Request的构造器中收集必要的信息
    constructor (options) {
        this.method = options.method || "GET"
        this.host = options.host
        this.port = options.port || 80
        this.path = options.path || '/'
        this.body = options.body || {}
        this.headers = options.headers || {}
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body)
        } else if (this.headers["Content-Type"] = "application/x-www-form-urlencoded") {
            // this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`)
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')

        }
        // 之前问题出在这里！！！！并没有获得正确的长度
        this.headers["Content-Length"] = this.bodyText.length
    }
    // 通过send函数间请求发送到服务器，send函数是异步函数，所以返回Promise
    // send 采用传入的已建立的tcp连接，如果tcp连接未建立，那么重新建立一个tcp连接
    send (connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString())
            } else {
                // 如果没有传入connection参数，则新建一个tcp连接
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    let str = this.toString();
                    connection.write(str)
                })
            }

            // connection监听
            connection.on('data', (data) => {
                // console.log(data.toString())
                parser.receive(data.toString())
                if (parser.isFinished) {
                    resolve(parser.response)
                }
                connection.end()
            });
            // 监听错误
            connection.on('error', (err) => {
                reject(err)
                connection.end()
            })

        })
    }

    toString () {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join(`\r\n`)}\r
\r
${this.bodyText}`
    }

}

class ResponseParser {
    constructor () {
        this.WAITING_STATUS_LINE = 0
        this.WAITING_STATUS_LINE_END = 1
        this.WAITING_HEADER_NAME = 2
        this.WAITING_HEADER_SPACE = 3
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5
        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY = 7
        
        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ""
        this.headers = {}
        this.headerName = ""
        this.headerValue = ""
        this.bodyParser = null
    }

    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinished
    }

    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)

        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive (str) {
        for (let i = 0; i < str.length; i++) {
            this.receiveChar(str.charAt(i))
        }
    }
    // 状态机
    receiveChar (char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            } else {
                this.statusLine += char
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END
                //
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser()
                }
            } else {
                this.headerName += char
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ""
                this.headerValue = ""
            } else {
                this.headerValue += char
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY
            }
        } else if (this.current === this.WAITING_BODY) {
            // console.log(char)
            this.bodyParser.receiveChar(char)
        }
    }
}

class TrunkedBodyParser {
    constructor () {
        this.WAITING_LENGTH = 0
        this.WAITING_LENGTH_LINE_END = 1
        this.READING_TRUNK = 2
        this.WAITING_NEW_LINE = 3
        this.WAITING_NEW_LINE_END = 4

        this.length = 0
        this.content = []
        this.isFinished = false
        this.current = this.WAITING_LENGTH
    }

    receiveChar (char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true
                }
                this.current = this.WAITING_LENGTH_LINE_END
            } else {
                this.length *= 16
                this.length += parseInt(char, 16)
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char)
            this.length--
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE
            }
        } else if ( this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END
            }
        } else if ( this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH
            }
        }
    }
}



// 实现客户端http请求
void async function () {
    // 创建请求
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '9000',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'Irenia'
        }
    })
    // 发送请求
    let response = await request.send()
    // 实际使用中的浏览器是逐段解析body 
    let dom = parser.parseHTML(response.body)
    console.log(dom)
}()