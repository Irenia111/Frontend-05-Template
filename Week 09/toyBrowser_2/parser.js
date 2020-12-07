// 通过css的包，实现css的语法解析 npm install css
const css = require('css')

const EOF = Symbol('EOF') // end of file
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{type: 'document', children: []}]

// css computing
// css 规则收集
let rules = []
function addCSSRules (text) {
    let ast = css.parse(text)
    // console.log(JSON.stringify(ast, null, '   '))
    rules.push(...ast.stylesheet.rules)
}

function match (element, selector) {
    if (!selector || !element.attributes || !element) return false

    /**
     * 简单选择器
     */

    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) 
            return true
    } else if (selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) 
            return true
    } else {
        if (element.tagName === selector) {
            return true
        }
    }

    /**
     * 复合选择器
     * 三类选择器： id class tag
     * id选择器： #id tag, #id .class
     * 类选择器： .class tag, .class #id 
     * 标签选择器：tag .class, tag #id
     
    if (selector.match(/^\#\w|\#\w[\n\t\f ]\.\w|\#\w[\n\t\f ]\w$/)) {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) return true
    } else if (selector.match(/^\.\w|\#w[\n\t\f ]\.w|\#\w[\n\t\f ]\w$/)) {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) return true
    } else {
        if (element.tagName === selector) {
            return true
        } else if (selector.match(/^\w|\w[\n\t\f ]\#\w|$\w[\n\t\f ]\.\w$/)) {
            return true
        }
    }
    */

    return false
}

// 实现css的权重
function specificity (selector) {
    // inline id class tag
    let p = [0, 0, 0, 0]
    let selectorParts = selector.split(' ')
    for (let part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1
        } else if (part.charAt(0) === '.') {
            p[2] += 1
        } else {
            p[3] += 1
        }
    }

    return p
}

function compare (sp1,sp2) {
    // if (sp1[0] - sp2[0]) return sp1[0] - sp2[0]
    if (sp1[1] - sp2[1]) return sp1[1] - sp2[1]
    if (sp1[2] - sp2[2]) return sp1[2] - sp2[2]

    return sp1[3] - sp2[3]
}

function computeCSS (element) {
    // 获取父元素序列 当前开标签的栈，对应的就是当前开元素层层嵌套的父元素
    let elements = stack.slice().reverse()
    // 选择器与元素的匹配 通过双循环实现
    if (!element.computedStyle) element.computedStyle = {}

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse()

        if(!match(element, selectorParts[0])) continue

        let matched = false

        let j = 1 // j 表示当前选择器的层级
        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        // 如果j的层级与选择器层级匹配，说明匹配成功
        if (j >= selectorParts.length) matched = true

        // 生产computed属性
        if (match) {
            // console.log('element', element, 'matched rule', rule)
            // 比较优先级
            let sp = specificity(rule.selectors[0])
            
            let computedStyle = element.computedStyle
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                }
                // 选择优先级更高的规则
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    // 新的规则权重大，则覆盖旧规则
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
                
            }
        }
    }

    // 内联样式
    /**
     let inlineStyle = element.attributes.filter(p => p.name === 'style)
     css.parse('*{' + inlineStyle + '})
     sp = [1, 0, 0, 0]
     for() {}
     */
}

// 输出节点 利用token建立dom树
function emit (token) {
    
    let top = stack[stack.length - 1]

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }

        element.tagName = token.tagName

        for (let p in token) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        //+++++++++++++++++ 添加css ++++++++++++++++//
        computeCSS(element)

        top.children.push(element)
        element.parent = top

        if (!token.isSelfClosing) stack.push(element)
        // 这里自封闭标签好像没有被处理。。。。估计是因为出栈条件是闭合标签与开标签匹配

        currentTextNode = null

    } else if (token.type === 'endTag') {
        if (top.tagName != token.tagName) {
            // 自闭合元素
            if (top.type === 'element') {
                stack.pop()
            } else {
                throw new Error('Tag start end doesn\'t match!')
            }
        } else {
            // ++++++++++++ 遇到style标签，执行添加css的操作 +++++++++++ //
            // 不考虑link标签及 引入外界样式表的操作
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop()
        }
        currentTextNode = null
    } else if (token.type === 'text') {
        // 文本节点
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

function data (c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
        return;
    } else {
        // 文本节点
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen (c) {
    if (c === '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        return ;
    }
}

function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') {

    } else if (c === EOF) {

    } else {
        
    }
}

function tagName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        // 匹配四类空白符: tab  换行符 禁止符 空格
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c // .toLowerCase()
        return tagName
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) {
        return afterAttributeName
    } else if (c === '=') {
        
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function attributeName (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {

    } else if (c === '"' || c === '\'' || c === '<') {

    } else {
        currentToken.name += c
        return attributeName
    }
}
function beforeAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '\'') {
        return singleQuotedAttributeValue
    } else if (c === '"') {
        return doubleQuotedAttributeValue
    } else if (c === '>') {

    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue (c) {
    if (c === '"') {
        currentToken[currentToken.name] = currentToken.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue (c) {
    if (c === '\'') {
        currentToken[currentToken.name] = currentToken.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentToken.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue (c) {

    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '\'' || c === '"' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentToken.value += c
        return UnquotedAttributeValue
    }
}

function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributrName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        // 处理属性
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        return data
    } else if (c === EOF) {

    } else {

    }
}

// 使用状态机解析html
module.exports.parseHTML = function parseHTML (html) {
    // console.log(html)
    let state = data
    for(let c of html) {
        state = state(c)
    }

    state = state(EOF)

    return stack[0]
}