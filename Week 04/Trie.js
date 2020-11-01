const $ = Symbol("$")
class Trie {
    constructor () {
        // 字典树根节点，空对象
        this.root = Object.create(null)
    }
    // 将字符串插入字典树
    insert (word) {
        let node = this.root
        // 遍历word中的每个字符，在root中查询插入位置
        for (let c of word) {
            if (!node[c]) {
                // 如果不存在对应节点，就创造新的空节点
                node[c] = Object.create(null)
            }
            node = node[c]
        }
        // 在字符串的尾端加入终止符 
        // 终止符使用“$”, 但为了防止字符中的“$”无法插入，所以使用symbol设置终止符
        if (!($ in node)) {
            node[$] = 0
        }
        // end终止符也对字符串出现的次数进行记录
        node[$]++

    }
    // 查询字典树中出现频数最大的字符串
    most () {

        let max = 0
        let maxWord = null
        let visit = (node, word) => {
            if (node[$] && node[$] > max) {
                max = node[$]
                maxWord = word
            }
            for (let p in node) {
                visit(node[p], word + p)
            }
        }
        visit(this.root, "")
        console.log(maxWord, max)
    }
}

// 生成随机字符串
function randomWord (length) {
    let s = ""
    for (let i = 0; i < length; i++) {
        s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0))
    }
    return s
}

let trie = new Trie()

for (let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4))
}