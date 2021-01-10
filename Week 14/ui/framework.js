// createElement 覆盖了react jsx的转义函数
export function createElement (type, attributes, ...children) {
    let element
   
    if (typeof type === 'string') {
         // 如果 type 是字符串类型，说明是原生的dom元素
        // element = document.createElement(type)
        element = new ElementWrapper(type)
    } else {
         // 如果 type 不是字符串类型，element 为一个 type 的实例
        element = new type
    }

    for (let name in attributes) {
        element.setAttribute(name, attributes[name])
    }
    for (let child of children) {
        // 单独处理文本节点
        if (typeof child === 'string') {
            child = new TextWrapper(child)
        }
        element.appendChild(child)
    }
    return element;
}

export class Component {
    constructor (type) {
        // 调用render
        // this.root = this.render()
    }

    setAttribute (name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild (child) {
        // this.root.appendChild(child)
        child.mountTo(this.root)
    }
    // 将自定义元素挂载到body上
    mountTo (parent) {
        parent.appendChild(this.root)
    }

}

class ElementWrapper extends Component {
    constructor (type) {
        this.root = document.createElement(type)
    }
}

class TextWrapper extends Component{
    constructor (content) {
        this.root = document.createTextNode(content)
    }
}