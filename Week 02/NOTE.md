## A* 算法

优化点：

1. 小顶堆存储数据，每次都优先距离终点最近的点
2. 将节点与父节点的距离加入最终比较距离的参考 F = G + H
3. 记录节点入堆的情况，当终点出现在搜索点中时，即可停止搜索 ---》 有点像丑数那道题，在找到丑数前需要存储许多不需要的数，就像bfs的简单实现中，搜索了过多不必要的节点

待理清：

1. G 的关系
2. F 的效果为啥比不上 欧式距离 + G

参考链接

https://zhuanlan.zhihu.com/p/55694998

https://www.jianshu.com/p/8905d4927d5f

https://blog.csdn.net/u010758410/article/details/82426672

https://blog.csdn.net/baimafujinji/article/details/50483247?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param

https://www.cnblogs.com/21207-iHome/p/6048969.html

https://blog.csdn.net/hitwhylz/article/details/23089415
