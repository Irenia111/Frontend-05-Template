/** 启发式搜索 + bfs寻路算法框架 + 路径描绘 
 * 
 * 启发式搜索 -->> 在bfs的基础上进行优化
 * 1. 利用小顶堆，每次在寻路的点，都是距离终点最近的点 -->> 有点贪心的意味
 * 2. 在每次将寻路点推入小顶堆时，都需要进行优化 -->> 我猜可以拿距离起点的距离进行过滤！！我想对啦2333
 * 3. 参考A*算法，在将节点存入的时候，对节点和搜索节点到终点的距离进行比较，如果搜索节点大于现有节点，那么就不存储搜索节点
 */
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
// 使用sorted代替普通数组 距离终点短的，优先查找
// 其实每次插入，都sort一下，似乎也可以
// 将sorted改造为小顶堆，每次插入和取出都进行堆化操作
class Sorted {
    constructor (data, compare) {
        this.data = data.slice();
        this.compare = compare ? compare : ((a, b) => a - b);
    }
    take () {
        // 输出值
        if (!this.data.length) return;
        // 只有一个的时候，直接pop
        if (this.data.length === 1) return this.data.pop()
        // 其实相当于做了一次排序
        // 原地建堆，从后往前，自上而下式建小顶堆
        // 因为堆的编号从 1 开始，所以在data头部加入一个空元素
        this.data.unshift([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY])
        buildHeap (this.data, this.data.length - 1, this.compare)

        // 原地建堆
        // arr: 原始序列
        // n: 初始有效序列长度， 由于数组的第一个元素为空，所以输入的n为arr.length - 1
        function buildHeap (arr, n, compare) {
            
            // 堆其实可以用一个数组表示，给定一个节点的下标 i （i从1开始） ，那么它的父节点一定为 A[i/2] ，左子节点为 A[2i] ，右子节点为 A[2i+1]
            if(n === 1) return
            for(let i = Math.floor(n/2); i>=1 ; i--) {
                heapify(arr, n, i, compare)
            }
        }
        function heapify (arr, n, i, compare) {
            // 自上而下式堆化
            while (true) {
                let minIndex = i
                if(2*i <= n && compare(arr[2*i], arr[i]) < 0)  {
                    minIndex = 2*i
                }
                if(2*i+1 <= n && compare(arr[2*i+1], arr[minIndex]) < 0) {
                    minIndex = 2*i+1
                }
                if(minIndex !== i) {
                    swap(arr, i, minIndex)
                    i = minIndex
                } else {
                    break
                }
            }
            function swap (arr, i , j) {
                let temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }

        
        
        // 每次都取出第一个元素
        let min = this.data[1]
        // 每次都将第一个空元素删除
        this.data.shift()
        // 删除最小的元素
        this.data.shift()
        return min
    }

    give (v) {
        // 加入值
        this.data.push(v)
    }

}
// 通过增加异步 实现算法运算时的时间延长 实现可视化
function sleep (t) {
    return new Promise (function(resolve) {
        setTimeout(resolve, t)
    })
}

// 通过 async 使函数可以进行异步操作
async function findPath (map, start, end) {
    board.children[start[0] + 100 * start[1]].style.backgroundColor = "orange"
    board.children[end[0] + 100 * end[1]].style.backgroundColor = "red"
    if (map[start[0] + 100 * start[1]] === 1) {
        console.log('start is block')
        return false
    }
    if (map[end[0] + 100 * end[1]] === 1) {
        console.log('end is block')
        return false
    }
    // 记录寻路的前驱节点
    let table = Object.create(map)
    let gScore = Object.create(map)
    gScore[start[1] * 100 + start[0]] = 0
    let fScore = Object.create(map)
    fScore[start[1] * 100 + start[0]] = heuristic_cost_estimate(start)
    let closeList = new Set()
    let openList = new Set()
    
    
    // queue就是openList
    let queue = new Sorted([start], (a, b) => distance(a) - distance(b));
    
    while (queue.data.length) {
        
        let [x, y] = queue.take();
        board.children[y * 100 + x].style.backgroundColor = "yellow"
        // 选择距离最近的点之后，出现的问题是，如果被挡住，这个算法要绕道，看起来绕不过去
        // 在insert里面保存上一次弹出的元素，如果弹出元素和上一次一样，那么就需要跳过当前点，到次一级的点

        openList.delete(x + '_' + y)
        closeList.add(x + '_' + y)
        // debugger
        
        // 同步调用 insert 异步函数
        await insert(x + 1, y, [x, y])
        await insert(x, y + 1, [x, y])
        await insert(x - 1, y, [x, y])
        await insert(x, y - 1, [x, y])

        await insert(x + 1, y + 1, [x, y])
        await insert(x + 1, y - 1, [x, y])
        await insert(x - 1, y - 1, [x, y])
        await insert(x - 1, y + 1, [x, y])

        //终点在开放链表中，则找到路径
        if (openList.has(end[0] + '_' + end[1])) {
            let [x, y] = end
            // 找到终点 x , y
            console.log(x +'_'+ y)
            board.children[y * 100 + x].style.backgroundColor = "red"

            // 复原路径

            while (start[0] !== x || start[1] !== y) {
                await sleep(1)
                // 将节点依次从终点复原
                // 拿出前驱节点
                let cur = table[y * 100 + x]
                x = cur[0]
                y = cur[1]
                // debugger
                board.children[y * 100 + x].style.backgroundColor = "lightpink"
            }
            // 标记终点颜色
            board.children[y * 100 + x].style.backgroundColor = "purple"

            return true
        }
        
    }

    async function insert (x, y, pre) {

        if (x < 0 || x >= 100 || y < 0 || y >= 100) return
        // 略过障碍及已标记的点
        // 略过已访问过的点 --》 解决遇到死胡同，不会绕路的问题
        
        if (closeList.has(x + '_' + y) || map[y * 100 + x] === 1) return

        // 修改对应cell的背景颜色
        await sleep(5)
        board.children[y * 100 + x].style.backgroundColor = "lightgreen"
        // 存储pre
        let pre_gScore = gScore[pre] + distanceBetween(pre, [x, y])
        if (!openList.has(x + '_' + y)) {
            openList.add(x + '_' + y)
            queue.give([x, y])

            table[y * 100 + x] = pre
            // 感觉这个用得不太对
            if (pre_gScore < gScore[y * 100 + x]) {
                // 更新gScore
                gScore[y * 100 + x] = pre_gScore
                // 更新fScore
                fScore[y * 100 + x] = pre_gScore + heuristic_cost_estimate([x, y])
            }
        }

    }

    function distance (point) {
        // return (Math.abs(end[0] - point[0]) + Math.abs(end[1] - point[1])) * 10 + gScore[point[1] * 100 + point[0]]

        return ((end[0] - point[0]) ** 2 + (end[1] - point[1]) ** 2) + gScore[point[1] * 100 + point[0]]
        // return fScore[point[1] * 100 + point[0]]
    }

    function getFScore (point) {
        return fScore[point[1] * 100 + point[0]]
    }
    function distanceBetween (point1, point2) {
        let x = point1[0] - point2[0]
        let y = point1[1] - point2[1]
        // 相当于一个边是10分，对角边是14
        return x === 1 && y === 1 ? 14 : 10
        //return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)
    }
    // 这个距离的原理没有摸清楚，感觉有点诡异
    function heuristic_cost_estimate (neighbor) {
        let x = end[0] - neighbor[0]
        let y = end[1] - neighbor[1]
        return (Math.abs(x) + Math.abs(y)) * 10
    }
    
    return false
}