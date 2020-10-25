// 词法分析 正则表达式
const regexp = /([0-9\.]+)|([\t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
// ([0-9\.]+) 匹配数字  ([\t]+)匹配空格 ([\r\n]+)匹配换行
const dictionary = ["Number","Whitespace","LineTerminator","*","/","+","-"]

// function*
function* tokenize (source) {
    let result = null
    let lastIndex = 0

    do {
        lastIndex = regexp.lastIndex
        // 词法分割
        result = regexp.exec(source)
        // 如果没有匹配项，那么就跳出循环
        if (!result) break

        if (regexp.lastIndex - lastIndex - result[0].length) break
        // 使用token存储结果
        let token = {
            type: null,
            value: null
        }

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                console.log(dictionary[i - 1])
                //
                token.type = dictionary[i - 1]
            }
        }
        // console.log(result)
        // 
        token.value = result[0]
        yield token;
    } while (result);
    
    // 终止
    yield { type: "EOF" }
}

let source = []

for (let token of tokenize("1024 + 10 * 25")) {
    console.log(token)
}

