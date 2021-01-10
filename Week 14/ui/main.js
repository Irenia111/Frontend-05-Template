import { createElement, Component } from './framework'

class Carousel extends Component{
    constructor () {
        super()
        // 当前元素存放 attributes
        this.attributes = Object.create(null)
    }

    render () {
        this.root = document.createElement('div')
        this.root.classList.add('carousel')
        // 将轮播的图片插入
        for (let record of this.attributes.src) {
            /* let child = document.createElement('img')
             * child.src = record
            */
            let child = document.createElement('div')
            child.style.backgroundImage = `url('${record}')`
            this.root.appendChild(child)
        }
        let isAuto = true
        // 如果当前是自动播放
        // if (isAuto) auto(this)
        

        // 记录每次移动前的偏移，这样鼠标抬起后会复位
        let position = 0

        // 实现鼠标拖动的功能
        this.root.addEventListener('mousedown', event => {
            // 停止轮播，响应 mousemove
            isAuto = false
            let children = this.root.children
            /**
             * clientX clientY 相对于浏览器的坐标
             * 记录 mousedown 之后的初始鼠标位置
             */
            let startX = event.clientX

            // 鼠标拖动时，只记录X方向
            let move = event => {
                // 记录拖动的方向，以及距离
                let x = (event.clientX - startX)

                let current = position - ((x - x % 500) / 500)

                // 重新排布当前图片(0)前(-1)后(1)的两张图片
                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset
                    pos = (pos + children.length) % children.length

                    children[pos].style.transition = 'none'
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }

                /*
                for (let child of children) {
                    // 依次要移动组内的每一张图
                    child.style.transition = 'none'
                    child.style.transform = `translateX(${- position * 500 + x}px)`
                }
                */

            }
            // 鼠标抬起，解除监听 停止拖拽，开始轮播
            let up = event => {
                let x = (event.clientX - startX)
                position = position - Math.floor(x / 500)

                // 鼠标抬起时，之后向前或者向后滚  这里要注意一张图超过250 px 只能往一个方向运动
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset
                    pos = (pos + children.length) % children.length

                    children[pos].style.transition = ''
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }
                isAuto = true

                /*
                for (let child of children) {
                    // 依次要移动组内的每一张图
                    child.style.transition = ''
                    child.style.transform = `translateX(${position * 500 + x}px)`
                }
                */

                document.removeEventListener('mousemove', move)
                document.root.removeEventListener('mouseup', up)
            }

            // 监听 document 上的鼠标运动
            document.addEventListener('mousemove', move)
            document.root.addEventListener('mouseup', up)
        })
        
        

        // 三秒轮播一轮 轮播通过重新排布 child 的顺序实现
        
        let currentIndex = 0
        setInterval(() => {
            let children = this.root.children
            let nextIndex = (currentIndex + 1) % children.length

            let current = children[currentIndex]
            let next = children[nextIndex]

            /*
             * next 的位置是在当前是当前位置减去它和 current 的偏移
             * 现将 next 挪到合适的位置
             */
            next.style.transition = 'none'
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`

            setTimeout(() => {
                // 恢复 next 的动画
                next.style.transition = ''
                // 设置 current 和 next 的位置变换
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
                next.style.transform = `translateX(${- nextIndex * 100}%)`

                // currentIndex 增加
                currentIndex = nextIndex
            }, 16) // 16ms 是浏览器内 1 帧的时间，不能使用requestAnimationFrame
            

            /*
            for (let child of children) {
                child.style.transform = `translateX(-${current * 100}%)`
            }
            */

        }, 3000)
    
        return this.root
    }
    // 重写setAttribute
    setAttribute (name, value) {
        this.attributes[name] = value
    }
    mountTo (parent) {
        // mount 时创建root
        parent.appendChild(this.render())
    }
    
}

const imgs = [   
    'https://static001.geekbang.org/resource/image/57/37/57f5bd423b2afb7602b8a22d0559b737.jpg',
    'https://static001.geekbang.org/resource/image/95/d1/95775d0927a580170673aedfc70e33d1.jpg',
    'https://static001.geekbang.org/resource/image/a6/f1/a691e6b628ceb9d7c2ca9780126301f1.jpg',
    'https://static001.geekbang.org/resource/image/b1/d6/b1b70d207fed37fd54c127f9667d1fd6.jpg'
]

let carousel = <Carousel src = { imgs }/>
carousel.mountTo(document.body)