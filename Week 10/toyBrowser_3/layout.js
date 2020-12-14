// 实现元素style的解析
function getStyle (element) {
    if (!element.style) element.style = {}

    for (let prop in element.computedStyle) {
        const p = element.computedStyle.value
        element.style[prop] = element.computedStyle[prop].value

        // 解析px对应的数值
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])

        }
        // 解析数字
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }

    return element.style
}

function layout (element) {
    // 没有 computedStyle 的元素，直接返回
    if (!element.computedStyle) return

    // 1. 对element进行预处理，将style中的字符串，解析成数字
    let elementStyle = getStyle(element)
    // 只支持flex
    if (elementStyle.display !== 'flex') return
    // 2. 过滤文本节点，保留元素
    let items = element.children.filter(e => e.type === 'element')
    // 3. 支持order属性
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0)
    })
    // 4. 初始化flex值
    let style = elementStyle
    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row'
    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch'
    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start'
    if (!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nonwrap'
    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch'

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;   
   
    if (style.flexDirection === 'row') {
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1 // 正1 
        mainBase = 0

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1 
        mainBase = style.width

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1 
        mainBase = 0

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1 
        mainBase = style.height

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }
    
    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    } else {
        crossSign = +1
        crossBase = 0
    }

    // 5. 收集元素进 行（line）
    // 元素没有设置flex值，直接设置为auto
    let isAutoMainSize = false
    if (!style[mainSize]) { // auto sizing
        elementStyle[mainSize] = 0
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                // void 运算符，返回值永远是undefined
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
            }
        }
        isAutoMainSize = true
    }
    // 5.1 准备 felx 的行
    let flexLine = []
    let flexLines = [flexLine]

    let mainSpace = elementStyle[mainSize] // 剩余空间
    let crossSpace = 0

    for (let i = 0 ; i < items.length; i++) {
        let item = items[i]
        let itemStyle = getStyle(item)

        if (itemStyle[mainSize] == null) { // 主轴尺寸默认值为 0
            itemStyle[mainSize] = 0
        }


        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize]
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            // 换行
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace
                flexLine = [item]
                flexLines.push(flexLine)
                mainSpace = style[mainSpace]
                crossSpace = 0
            } else {
                flexLine.push(item)
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace

    // 5.2 计算主轴
    if (style.flexWrap === 'nonwrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace
    }

    if (mainSpace < 0) {
        // overflow
        let scale = style[mainSize] / (style[mainSize] - mainSpace)
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let itemStyle = getStyle(item)

            // 如果有flex属性，那么不压缩
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0
            }

            itemStyle[mianSize] = itemStyle[mianSize] * scale

            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mianSize]
            // 下一个元素的主轴是上一个元素的mainEnd
            currentMain = itemStyle[mainEnd]
        }
    } else {
        // 处理每一 flex 行
        // process each flex line
        flexLine.forEach(function (items) {

            let mainSpace = items.mainSpace
            let flexTotal = 0
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                let itemStyle = getStyle(item)

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex
                    continue
                }
            }

            if (flexTotal > 0) {
                // 
                let currentMain = mainBase
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    let itemStyle = getStyle(item)

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mianSize]
                    currentMain = itemStyle[mainEnd]
                }
            } else {
                // 如果没有flex的item，那么 justifyContent 需要起作用
                let currentMain, step
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase
                    step = 0
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase
                    step = 0
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase
                    step = 0
                }
                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign
                    currentMain = mainBase
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign
                    currentMain = step / 2 + mainBase
                }

                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    let itemStyle = getStyle(item)

                    itemStyle[mainStart] = currentMain
                    // itemStyle[mainStart, currentMain]
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mianSize]
                    currentMain = itemStyle[mainEnd] + step
                }
            }
        })
    }

    // 5.3 计算交叉轴
    let crossSpace

    if (!style[crossSize]) {
        // 父元素 无行高，子元素的高度将父元素撑开
        crossSpace = 0
        elementStyle[crossSize] = 0
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
        }
    } else {
        // 父元素有行高，将子元素高度减去
        crossSpace = style[crossSize]
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace
        }
    }
    // 根据 flexWrap 校正交叉轴的高度
    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize]
    } else {
        crossBase = 0
    }
    // 
    let lineSize = style[crossSize] / flexLines.length

    let step 
    if (style.alignContent === 'flex-start') {
        crossBase += 0
        step = 0
    }

    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace
        step = 0
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2
        step = 0
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0
        step = crossSpace / (flexLines.length - 1)
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / flexLines.length
        crossBase += crossSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0
        step = 0
    }

    // 每行分别处理
    flexLines.forEach(function (items) {
        let lineCrossSize = style.alignContent === 'stretch' ? 
        items.crossSpace + crossSpace / flexLines.length :
        items.crossSpace;

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let itemStyle = getStyle(item)

            let align = itemStyle.alignSelf || style.alignItems

            if (item == null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize = itemStyle[crossSize]) / 2
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize)
                
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step)
    })
    console.log(items)
}

module.exports = layout