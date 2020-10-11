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


