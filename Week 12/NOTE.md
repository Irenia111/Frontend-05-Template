Week 12

# CSS 盒模型
## 盒模型
box-sizing 属性影响盒模型宽度的计算，box-sizing 可选择为 content-box 和 border-box,默认为值 content-box。
* content-box
    默认值，标准盒子模型。 width 与 height 只包括内容的宽和高，不包括边框（border），内边距（padding），外边距（margin）。
* border-box
    width 和 height 属性包括内容，内边距（padding）和边框（border），但不包括外边距（margin）。

# 排版
## 第一代：正常流
* BFC
* margin 折叠
* float & clear
    float: 当一个元素浮动之后，它会被移出正常的文档流，然后向左或者向右平移，一直平移直到碰到了所处的容器的边框，或者碰到另外一个浮动的元素。

    clear: CSS 属性指定一个元素是否必须移动(清除浮动后)到在它之前的浮动元素下面。clear 属性适用于浮动和非浮动元素。
## 第二代： Flex (当前主流)
## 第三代： Grid

# 动画
## Animation
```html
<style>
@keyframes mykf
{
    from { background: red;}
    to {background: yellow;}
}

div {
    animation: mykf 5s infinite;
}
</style>
<div style="width: 100px; height: 100px;">
</div>
```

* animation-name 时间曲线
* animation-duration 动画时长
* animation-timing-function 动画的时间曲线
* animation-delay 动画开始前的延迟
* animation-iteration-count 动画的播放次数
* animation-direction 动画的方向

## Transition

* transition-property 要变换的属性；
* transition-duration 变换的时长；
* transition-timing-function 时间曲线；
* transition-delay 延迟。

<a href='https://cubic-bezier.com/#.17,.67,.83,.67'>三次贝塞尔曲线</a>