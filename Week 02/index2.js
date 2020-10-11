/** bfs寻路算法的框架 */
/** 地图编辑器实现 */
let board = document.getElementById('board')
// 初始化地图数组
let map = localStorage["map"] ? JSON.parse(localStorage["map"]) : Array(100 * 100).fill(0)
// 
let mouseDown = false
// 按右键清除路径 clear
let clear = false
initMap(board, 100)
document.addEventListener("mousedown", (e) => {
    mouseDown = true
    // button事件 0：左键 1：中键 2：右键 which属性已被弃用
    clear = (e.button === 2)
})
document.addEventListener("mouseup", () => { mouseDown = false })
// 阻止右键的默认事件
document.addEventListener("contextmenu", e => e.preventDefault())

/** 按钮功能 */
// 保存地图
let save = document.getElementById("save")
save.addEventListener("click", () => {
    localStorage["map"] = JSON.stringify(map)
})


/** 初始化地图 */
function initMap (board, num) {
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
            let cell = document.createElement('div')
            cell.classList.add('map-cell')
            if (map[num * i + j] === 1) cell.style.backgroundColor = "black"
            cell.addEventListener('mousemove', () => draw(cell, i, j))
            board.appendChild(cell)
        }
    }
    function draw (cell, i, j) {
        // console.log('1111')
        if (mouseDown) {
            if (clear) {
                cell.style.backgroundColor = ""
                map[100 * i + j] = 0
            } else {
                cell.style.backgroundColor = "black"
                map[100 * i + j] = 1
            }
        }

    }
}


/** 广度优先寻路算法实现 */
// 通过增加异步 实现算法运算时的时间延长 实现可视化
function sleep (t, resolve) {
    return new Promise (function() {
        setTimeout(resolve, t)
    })
}

// 通过 async 使函数可以进行异步操作
async function findPath (map, start, end) {
    let queue = []
    queue.push(start) 

    while (queue.length > 0) {
        
        let [x, y] = queue.shift()
        if (end[0] === x && end[1] === y) return true
        
        // 同步调用 insert 异步函数
        await insert(x + 1, y)
        await insert(x, y + 1)
        await insert(x - 1, y)
        await insert(x, y - 1)

        await insert(x + 1, y + 1)
        await insert(x + 1, y - 1)
        await insert(x - 1, y - 1)
        await insert(x - 1, y + 1)
        
    }

    async function insert (x, y) {
        if (x < 0 || x >= 100 || y < 0 || y >= 100) return
        // 略过障碍及已标记的点
        if (map[y * 100 + x]) return

        // 修改对应cell的背景颜色
        await sleep(1)
        board.children[y * 100 + x].style.backgroundColor = "lightgreen"

        // 可到达的点，标2
        map[y * 100 + x] = 2
        queue.push([x, y])
    }

    return false
}