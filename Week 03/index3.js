// 1. 词法分析 正则表达式
const regexp = /([0-9\.]+)|([\t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g
// ([0-9\.]+) 匹配数字  ([\t]+)匹配空格 ([\r\n]+)匹配换行
const dictionary = ["Number","Whitespace","LineTerminator","*","/","+","-"]

// 2. 词法分析
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

for (let token of tokenize("10 * 25")) {
    if (token.type !== "Whitespace" && token.type !== "LineTerminator")
    // console.log(token)
    source.push(token)
}
// 3. 语法分析
// 3.3 加入 EOF
function Expression (tokens) {
    if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF") {
        let node = {
            type: "Expression",
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
        // 最后生成一个语法树
        return node
    }
    // 输入数字等，直接进入AdditiveExpression
    AdditiveExpression(source)
    return Expression(source)

}
// 3.2 加法分析 加法的优先级低于乘法，所以在乘法分析之后 乘法是运算次数为0的加法
function AdditiveExpression (source) {
    if (source[0].type === "MultiplicativeExpresstion") {
        let node = {
            type: "AdditiveExpression",
            children: [source[0]]
        }
        source[0] = node
        return AdditiveExpression(source)
    }

    if (source[0].type === "MultiplicativeExpresstion" && source[1].type === "+") {
        let node = {
            type: "AdditiveExpression",
            operator: "+",
            children: []
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        // 将source中的非终止符处理掉
        MultiplicationExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        
        return AdditiveExpression(source)
    }

    if (source[0].type === "MultiplicativeExpresstion" && source[1].type === "-") {
        let node = {
            type: "AdditiveExpression",
            operator: "-",
            children: []
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        // 将source中的非终止符处理掉
        MultiplicationExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        
        return AdditiveExpression(source)
    }
     // 输入为 数字、乘号及除号 以外的输入，直接return
     if (source[0].type === "AdditiveExpression") {
        return source[0]
    }
    // 如果输入的数字，先进入乘法分析环节
    MultiplicationExpression(source)

    return AdditiveExpression(source)
}
// 3.1 乘法语法分析 加法是运算次数为0的乘法
function MultiplicationExpression (source) {
    // 开头输入为两种
    if (source[0].type === "Number") {
        // 将数字开头的表达式标记为乘法表达式
        let node = {
            type: "MultiplicativeExpression",
            children: [source[0]]
        }

        source[0] = node 
        // 递归调用 进入乘法 & 除法 分支
        return MultiplicationExpression(source)
    }
    // 处理 乘法
    if (source[0].type === "MultiplicativeExpresstion" && source[1].type === "*") {
        let node = {
            type: "MultiplicativeExpresstion",
            operator: "*",
            children: []
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        node.children.push(source.shift())
        // 新生成的结构再传入source
        source.unshift(node)
        return MultiplicationExpression(source)
    }
    // 处理 除法
    if (source[0].type === "MultiplicativeExpresstion" && source[1].type === "/") {
        let node = {
            type: "MultiplicativeExpresstion",
            operator: "/",
            children: []
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicationExpression(source)
    }
    // 输入为 数字、乘号及除号 以外的输入，直接return
    if (source[0].type === "MultiplicativeExpresstion") {
        return source[0]
    }
    // 这个return 应该不被执行
    return MultiplicationExpression(source)
    
}
// 输出结果为一个type为 MultiplicationExpression 的node，和EOF终止符
// console.log(MultiplicationExpression(source))