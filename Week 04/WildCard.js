// 算法只包含有*的情况，采用正则的方式实现
function find (source, pattern) {
    // 0. 统计字符串内的*号数量
    let startCount = 0
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === "*") startCount++
    }
    // 1. 不存在*号的情况
    if (startCount === 0) {
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] !== source[i] && pattern[i] !== "?") return false
        }
        return
    }

    // 2. 存在*号，则最后一个*竟可能匹配更长字符串，其余*匹配更短
    let i = 0
    // lastIndex指向source字符串
    let lastIndex = 0
    // 2.1 匹配第一个*号之前的字符串
    for (i = 0; pattern[i] !== "*"; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== "?") return false
    }

    lastIndex = i
    // 2.2 匹配之后包含*的字符串
    for (let p = 0; p < startCount - 1; p++) {
        i++
        // subPattern对应*号之后的字符串
        let subPattern = ""
        while (pattern[i] !== "*") {
            subPattern += pattern[i]
            i++
        }
        // 将subpPattern中的？替换成正则表达式的“任意字符” [\s\S]
        let reg = new RegExp(subPattern.replace(/\?/g,"[\\s\\S]"), "g")
        reg.lastIndex = lastIndex

        console.log(reg.exec(source))
        lastIndex = reg.lastIndex
    }
    // 2.3 最后一个*号之后，尾部的字符串匹配
    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - 1] !== "*"; j++) {
        if (pattern[pattern.length - j] !== source[source.length - j] 
            && pattern[pattern.length - j] !== "?")
            return false
    }
    return true
}

find("ancancnananna", "a*n*nx*c")