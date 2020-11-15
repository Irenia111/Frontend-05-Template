## toString 报错
JavaScript 规范中规定的数字直接量可以支持四种写法：十进制数、二进制整数、八进制整数和十六进制整数。十进制的 Number 可以带小数，小数点前后部分都可以省略，但是不能同时省略，我们看几个例子：
```js
.01
12.
12.01
```

这都是合法的数字直接量。这里就有一个问题，也是我们标题提出的问题，我们看一段代码：
```js
12.toString()
```
这时候12. 会被当作省略了小数点后面部分的数字，而单独看成一个整体，所以我们要想让点单独成为一个 token，就要加入空格，这样写：

```js
12 .toString()
```
## JavaScript 中的对象分类

* 宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。
* 内置对象（Built-in Objects）：由 JavaScript 语言提供的对象。  
    * 固有对象（Intrinsic Objects ）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
    * 原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
    * 普通对象（Ordinary Objects）：由{}语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。

 

### 宿主对象

JavaScript 宿主对象千奇百怪，但是前端最熟悉的无疑是浏览器环境中的宿主了。

在浏览器环境中，我们都知道全局对象是 window，window 上又有很多属性，如 document。

实际上，这个全局对象 window 上的属性，一部分来自 JavaScript 语言，一部分来自浏览器环境。

JavaScript 标准中规定了全局对象属性，W3C 的各种标准中规定了 Window 对象的其它属性。

宿主对象也分为固有的和用户可创建的两种，比如 document.createElement 就可以创建一些 DOM 对象。

宿主也会提供一些构造器，比如我们可以使用 new Image 来创建 img 元素。

### 内置对象·固有对象

固有对象是由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。

固有对象在任何 JavaScript 代码执行前就已经被创建出来了，它们通常扮演者类似基础库的角色。

“类”其实就是固有对象的一种。

ECMA 标准为我们提供了一份固有对象表，里面含有 150+ 个固有对象。

### 内置对象·原生对象

JavaScript 中能够通过语言本身的构造器创建的对象称作原生对象。

在 JavaScript 标准中，提供了 30 多个构造器。

![原生对象分类](https://img2018.cnblogs.com/blog/1345825/201910/1345825-20191014100620648-1596640981.png)

通过这些构造器，我们可以用 new 运算创建新的对象，所以我们把这些对象称作原生对象。

几乎所有这些构造器的能力都是无法用纯 JavaScript 代码实现的，它们也无法用 class/extend 语法来继承。

这些构造器创建的对象多数使用了私有字段, 例如：

* Error: [[ErrorData]]
* Boolean: [[BooleanData]]
* Number: [[NumberData]]
* Date: [[DateValue]]
* RegExp: [[RegExpMatcher]]
* Symbol: [[SymbolData]]
* Map: [[MapData]]

这些字段使得原型继承方法无法正常工作，所以，我们可以认为，所有这些原生对象都是为了特定能力或者性能，而设计出来的“特权对象”。

### 特殊行为的对象

除了上面介绍的对象之外，在固有对象和原生对象中，有一些对象的行为跟正常对象有很大区别。

它们常见的下标运算（就是使用中括号或者点来做属性访问）或者设置原型跟普通对象不同，这里我简单总结一下。

* Array：Array 的 length 属性根据最大的下标自动发生变化。
* Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
* String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
* Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
* 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
* 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
* bind 后的 function：跟原来的函数相关联。

### 获取全部 JavaScript 固有对象

我们从 JavaScript 标准中可以找到全部的 JavaScript 对象定义。JavaScript 语言规定了全局对象的属性。

三个值： Infinity、NaN、undefined。

九个函数：

* eval
* isFinite
* isNaN
* parseFloat
* parseInt
* decodeURI
* decodeURIComponent
* encodeURI
* encodeURIComponent

一些构造器：

Array、Date、RegExp、Promise、Proxy、Map、WeakMap、Set、WeakSet、Function、Boolean、String、Number、Symbol、Object、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError、ArrayBuffer、SharedArrayBuffer、DataView、Typed Array、Float32Array、Float64Array、Int8Array、Int16Array、Int32Array、UInt8Array、UInt16Array、UInt32Array、UInt8ClampedArray。

四个用于当作命名空间的对象：

* Atomics
* JSON
* Math
* Reflect

一些固有对象：

```js
var set = new Set();
var objects = [
    eval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Array,
    Date,
    RegExp,
    Promise,
    Proxy,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect];
objects.forEach(o => set.add(o));

for(var i = 0; i < objects.length; i++) {
    var o = objects[i]
    for(var p of Object.getOwnPropertyNames(o)) {
        var d = Object.getOwnPropertyDescriptor(o, p)
        if( (d.value !== null && typeof d.value === "object") || (typeof d.value === "function"))
            if(!set.has(d.value))
                set.add(d.value), objects.push(d.value);
        if( d.get )
            if(!set.has(d.get))
                set.add(d.get), objects.push(d.get);
        if( d.set )
            if(!set.has(d.set))
                set.add(d.set), objects.push(d.set);
    }
}
```