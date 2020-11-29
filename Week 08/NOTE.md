## http 协议
* 文本协议，非二进制协议（将内容按照bit传输），协议中内容都是字符串的一部分
* http request组成
  * Request line: 一行
  * header: 长度不固定，通过一行空白行和body分开
    * content type是必要字段，要有默认值
    * 不同的content type将影响body格式
  * body: 请求内容
    * kv格式
* http response组成
  * status line
    * 协议及版本 
    * 状态码
  * headers 和body间有一个空行
  * body
    * chunked body
      * 开头为16进制数字，单独占一行
      * 结尾为0，单独占一行
## 使用状态机匹配字符串
### 匹配无重复的字符串
```js
// 匹配 ’abcdef‘
function match (str) {
    let state = start; //这里直接引用函数
    for (let c of str) {
        state = state(c) // 执行当前最新的state的函数， 相当于使用上一次返回的函数
    }

    return state === end
}

function start (c) {
    if (c === 'a') {
        return foundA
    } else {
        return start //  下一次依旧执行start
    }
}
function end (c) {
    // 找到末尾之后，输入的所有字符都会返回end，相当于trap（断路？？？）
    return end
}

function foundA (c) {
    if (c === 'b') {
        return foundB
    } else {
        // return start 如果只返回函数，就会错过本次检查字符是否是开头’a‘
        return start(c) // 下一次从 start 开始执行，如果字符是 ’a‘, 那么就会从头开始匹配
    }
}

function foundB (c) {
    if (c === 'c') {
        return foundC
    } else {
        return start(c)
    }
}

function foundC (c) {
    if (c === 'd') {
        return foundD
    } else {
        return start(c)
    }
}

function foundD (c) {
    if (c === 'e') {
        return foundE
    } else {
        return start(c) 
    }
}

function foundE (c) {
    if (c === 'f') {
        return end
    } else {
        return start(c)  
    }
}
```
### 匹配有重复的字符串
```js
// 匹配 abcabx
function match (str) {
    let state = start
    for (let c of str) {
        state = state(c)
    }
    return state === end
}

function start (c) {
    if (c === 'a') {
        return foundA
    } else {
        return start
    }
}
function end (c) {
    return end
}

function foundA (c) {
    if (c === 'b') {
        return foundB
    } else {
        return start(c) 
    }
}

function foundB (c) {
    if (c === 'c') {
        return foundC
    } else {
        return start(c)
    }
}

function foundC (c) {
    if (c === 'a') {
        return foundA2
    } else {
        return start(c)
    }
}

function foundA2 (c) {
    if (c === 'b') {
        return foundB2
    } else {
        return start(c) 
    }
}

function foundB2 (c) {
    if (c === 'x') {
        return end
    } else {
        // 已匹配了ab，所以检查字符是不是’c‘
        return foundB(c)  
    }
}

```
```js
// 匹配 ’abababx‘
// 感觉引入全局变量，就是有副作用了
let count = 3

function match (str) {
    let state = start
    for (let c of str) {
        state = state(c)
    }
    return state === end
}

function start (c) {
    if (c === 'a') {
        count--
        return foundA
    } else {
        count = 3
        return start
    }
}
function end (c) {
    return end
}

function foundA (c) {
    if (countB c === 'b') {
      if (count > 0 ) {
        // 下一次查找字符是否为’a‘
        return start
      } else {
        return foundX
      }
    } else {
      return start(c)
    }
}

function foundX (c) {
    if (c === 'x') {
      return end
    } else {
      return start(c)
    }
}

```
### 状态机实现 KMP 算法
```js
class State {
    constructor (ch, prev, next) {
        this.ch = ch
        this.prev = prev || this
        this.next = next || this
    }

    transfer (ch) {
        if (ch === this.ch) {
            return this.next
        }

        if (this.prev !== this) {
            return this.prev.transfer(ch)
        }

        return this
    }

}

const STATE_END = 'End'

function buildGraph (str) {
    const pre = Array(str.length).fill(0)
    // 根据 KMP 算法确定 pre
    let j = 0
    for (let i = 2; i < str.length; i++) {
        pre[i] = str[i - 1] === str[pre[i - 1]] ? pre[i - 1] + 1 : 0
    }
    const stateList = []
    for (const ch of str) {
        // 状态机初始化
        stateList.push(new State(ch))
    }
    // 设置运行终止标志
    stateList.push(new State(STATE_END))

    for (let i = 0; i < str.length; i++) {
        stateList[i].next = stateList[i + 1]
        // 设置前驱节点
        stateList[i].prev = stateList[pre[i]]
    }

    return stateList[0]
}

function match (source, initialState) {
    let state = initialState
    for (const c of source) {
        state = state.transfer(ch)
    }
    // 最终是终止状态，说明匹配成功
    return state.ch === STATE_END
}

const initialState = buildGraph('abcabx')

// 测试
console.log(match('abcabxabc', initialState) === true)
```