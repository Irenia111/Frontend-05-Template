// 词法分析 正则表达式
const regexp = /([0-9\.]+)|([\t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
// ([0-9\.]+) 匹配数字  ([\t]+)匹配空格 ([\r\n]+)匹配换行
const dictionary = ["Number","Whitespace","LineTerminator","*","/","+","-"]


function tokenize (source) {
    let result = null

    while (true) {
        // 词法分割
        result = regexp.exec(source)
        // 如果没有匹配项，那么就跳出循环
        if (!result) break

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                console.log(dictionary[i - 1])
            }
            console.log(result)
        }
    }
}

tokenize("1024 + 10 * 25")