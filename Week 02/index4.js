/** 启发式搜索 + bfs寻路算法框架 + 路径描绘 
 * 
 * 启发式搜索 -->> 在bfs的基础上进行优化
 * 1. 利用小顶堆，每次在寻路的点，都是距离终点最近的点 -->> 有点贪心的意味
 * 2. 在每次将寻路点推入小顶堆时，都需要进行优化 -->> 我猜可以拿距离起点的距离进行过滤，
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
class Sorted {
    constructor (data, compare) {
        this.data = data.slice();
        this.compare = compare ? compare : ((a, b) => a - b);
        this.visited = {}
    }
    take () {
        // 输出值
        if (!this.data.length) return;

        let minIndex = 0
        let min = this.data[0]

        for (let i = 0; i < this.data.length; i++) {
            // 使用传递进来的compare函数
            if (this.compare(this.data[i], min) < 0) {
                minIndex = i
                min = this.data[i]
            }
        }
        // 将最小值输出 -->> 这个的时间是o(n)

        // 用最后一个元素将最小元素覆盖，不使用splice是因为splice会挪动元素，删除的时间是o(n)
        if(!this.visited[min[0]+'_'+min[1]]) {
            // 这种方式可以彻底覆盖最小的元素
            this.data[minIndex] = this.data[this.data.length - 1]
            this.data.pop()
            this.visited[min[0]+'_'+min[1]] = true
        } else {
            debugger
            // 这种方式没有覆盖最后一个元素，导致在map在起点和终点间存在直接阻碍的时候，findPath(map,[20,20],[30,30])在[26,35]的点死循环！！！
            // 如果最小元素就在数组的末尾，这种操作只会将pop出的末尾又按回原来的位置
            let last = this.data.pop()
            this.data[minIndex] = last
            minIndex = 0
            min = this.data[0]
            for (let i = 0; i < this.data.length; i++) {
                // 使用传递进来的compare函数
                if (this.compare(this.data[i], min) < 0) {
                    minIndex = i
                    min = this.data[i]
                }
            }
            last = this.data.pop()
            this.data[minIndex] = last
        }
        
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
    board.children[end[0] + 100 * end[1]].style.backgroundColor = "red"
    if (map[start[0] + 100 * start[1]] === 1) {
        console.log('start is block')
        return false
    }
    if (map[end[0] + 100 * end[1]] === 1) {
        console.log('end is block')
        return false
    }
    // 记录寻路的前驱节点-- 
    let table = Object.create(map)

    let queue = new Sorted([start], (a, b) => distance(a) - distance(b));
    // console.log(queue)
    
    while (queue) {
        
        let [x, y] = queue.take();
        board.children[y * 100 + x].style.backgroundColor = "yellow"
        // 选择距离最近的点之后，出现的问题是，如果被挡住，这个算法要绕道，看起来绕不过去
        // 在insert里面保存上一次弹出的元素，如果弹出元素和上一次一样，那么就需要跳过当前点，到次一级的点
        debugger
        // console.log(x)

        if (end[0] === x && end[1] === y) {
            // 找到终点 x , y
            console.log(x +'_'+ y)
            board.children[y * 100 + x].style.backgroundColor = "red"

            // 复原路径
            // let path = []

            while (start[0] !== x || start[1] !== y) {
                await sleep(1)
                // 将节点依次从终点复原
                // path.push(map[y * 100 + x])
                // 拿出前驱节点
                // console.log(table[y * 100 + x])
                let cur = table[y * 100 + x]
                x = cur[0]
                // 我猜这样它理解为数组越界？y = table[y * 100 + x][1]
                y = cur[1]
                // 为啥直接就读不出来？
                // 因为没有写分号！！！！所以被当成了一行
                // [x, y] = table[y * 100 + x]
                // console.log(table[y * 100 + x][1])
                board.children[y * 100 + x].style.backgroundColor = "lightpink"
            }
            // 标记终点颜色
            board.children[y * 100 + x].style.backgroundColor = "purple"

            return true
        }
        
        // 同步调用 insert 异步函数
        await insert(x + 1, y, [x, y])
        await insert(x, y + 1, [x, y])
        await insert(x - 1, y, [x, y])
        await insert(x, y - 1, [x, y])

        await insert(x + 1, y + 1, [x, y])
        await insert(x + 1, y - 1, [x, y])
        await insert(x - 1, y - 1, [x, y])
        await insert(x - 1, y + 1, [x, y])
        
    }

    async function insert (x, y, pre) {
        // console.log(x + '_' + y)
        // console.log(pre)
        // console.log(id)
        if (x < 0 || x >= 100 || y < 0 || y >= 100) return
        // 略过障碍及已标记的点
        // 略过已访问过的点 --》 解决遇到死胡同，不会绕路的问题
        
        if (table[y * 100 + x]) return

        // 修改对应cell的背景颜色
        await sleep(5)
        board.children[y * 100 + x].style.backgroundColor = "lightgreen"
        // 存储pre
        
        table[y * 100 + x] = pre
        // debugger
        queue.give([x, y])
        // console.log(pre)
        // 可到达的点，标2
        // map[y * 100 + x] = 2
    }

    function distance (point) {
        return ((end[0] - point[0]) ** 2 + (end[1] - point[1]) ** 2)
    }
    return false
}