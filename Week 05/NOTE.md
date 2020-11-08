## proxy
proxy 是ES6中新增的api，是对象的代理，实现了**对象的劫持**

```js
// 基本语法
const p = new Proxy(target, handler)
// target 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
// handler 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。 
```
Vue 3 使用 proxy 实现数据的响应式，替代了过去使用的 Object.defineProperty

## Object.defineProperty
Object.defineProperty 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象

```js
//语法
Object.defineProperty(obj, prop, descriptor)
// obj 是要在其上定义属性的对象
// prop 是要定义或修改的属性的名称
// descriptor 是将被定义或修改的属性描述符
```
descriptor 中的 get 和 set 是Vue 2X 实现数据响应的基础

<a href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get">get </a> 是一个给属性提供的 getter 方法，当我们访问了该属性的时候会触发 getter 方法

```js
const o = {a: 0};

Object.defineProperty(o, 'b', { get: function() { return this.a + 1; } });

console.log(o.b) // Runs the getter, which yields a + 1 (which is 1)
```

<a href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set">set </a> 是一个给属性提供的 setter 方法，当我们对该属性做修改的时候会触发 setter 方法

```js
const o = {a: 0};

Object.defineProperty(o, 'b', { 
  set: function(x) { this.a = x / 2; } 
});

o.b = 10; //  Runs the setter, which assigns 10 / 2 (5) to the 'a' property

console.log(o.a) //  5
```

一旦对象拥有了 getter 和 setter，我们可以简单地把这个对象称为响应式对象


#### Object.defineProperties
该方法与Object.defineProperty相似，只不过该方法可以一次性操作多个属性

## 基于数据劫持双向绑定的实现思路
基于数据劫持的双向绑定离不开 Proxy 与 Object.defineProperty 等方法对 对象/对象属性 的**"劫持"**,我们要实现一个完整的双向绑定需要以下几个要点。

* 利用Proxy或Object.defineProperty生成的Observer针对对象/对象的属性进行"劫持",在属性发生变化后通知订阅者
* 解析器Compile解析模板中的Directive(指令)，收集指令所依赖的方法和数据,等待数据变化然后进行渲染
* Watcher属于Observer和Compile桥梁,它将接收到的Observer产生的数据变化,并根据Compile提供的指令进行视图渲染,使得数据变化促使视图变化

![数据响应原理图](https://user-gold-cdn.xitu.io/2018/4/11/162b38ab2d635662?imageView2/0/w/1280/h/960/ignore-error/1)

![数据响应原理图](https://ustbhuangyi.github.io/vue-analysis/assets/reactive.png)

## Proxy VS Object.defineProperty
### Vue2.x响应式数据原理
Vue在初始化数据时，会使用Object.defineProperty重新定义data中的所有属性，当页面使用对应属性时，首先会进行依赖收集(收集当前组件的watcher)如果属性发生变化会通知相关依赖进行更新操作(发布订阅)。
### Object.defineProperty 的缺陷

* 无法监听数组变化 
    Object.defineProperty 在数组中的表现和在对象中的表现是一致的，数组的索引就可以看做是对象中的 key。
    
    * 通过索引访问或设置对应元素的值时，可以触发 getter 和 setter 方法。
    
    * 通过 push 或 unshift 会增加索引，对于新增加的属性，需要再手动初始化才能被 observe。

    * 通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法。

    所以，Object.defineProperty是有监控数组下标变化的能力的，只是 Vue2.x 放弃了这个特性。

    Vue2.x 将data中的数组进行了原型链重写，指向了自己定义的数组原型方法。这样当调用数组api时，可以通知依赖更新。如果数组中包含着引用类型，会对数组中的引用类型再次递归遍历进行监控。这样就实现了监测数组变化。
    ```js
    const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const arrayAugmentations = [];

    aryMethods.forEach((method)=> {
        // 这里是原生Array的原型方法
        let original = Array.prototype[method];

        // 将push, pop等封装好的方法定义在对象arrayAugmentations的属性上
        // 注意：是属性而非原型属性
        arrayAugmentations[method] = function () {
            console.log('我被改变啦!');

            // 调用对应的原生方法并返回结果
            return original.apply(this, arguments);
        };
    });
    ```

* 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历,显然能劫持一个完整的对象是更好的选择
    ```js
    Object.keys(value).forEach(key => this.convert(key, value[key]));
    ```

### Vue3.x响应式数据原理
Vue3.x改用Proxy替代Object.defineProperty。因为Proxy可以直接监听对象和数组的变化，并且有多达13种拦截方法。并且作为新标准将受到浏览器厂商重点持续的性能优化。

Proxy在ES2015规范中被正式发布,它在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写,我们可以这样认为,Proxy是Object.defineProperty的全方位加强版,具体的文档可以<a href="http://es6.ruanyifeng.com/#docs/proxy">查看此处</a>;

* Proxy直接可以劫持整个对象,并返回一个新对象,不管是操作便利程度还是底层功能上都远强于Object.defineProperty
* Proxy可以直接监听数组的变化,当我们对数组进行操作(push、shift、splice等)时，会触发对应的方法名称和length的变化
    ```js
    const list = document.getElementById('list');
    const btn = document.getElementById('btn');

    // 渲染列表
    const Render = {
        // 初始化
        init: function(arr) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < arr.length; i++) {
            const li = document.createElement('li');
            li.textContent = arr[i];
            fragment.appendChild(li);
            }
            list.appendChild(fragment);
        },
        // 我们只考虑了增加的情况,仅作为示例
        change: function(val) {
            const li = document.createElement('li');
            li.textContent = val;
            list.appendChild(li);
        },
    };

    // 初始数组
    const arr = [1, 2, 3, 4];

    // 监听数组
    const newArr = new Proxy(arr, {
        get: function(target, key, receiver) {
            console.log(key);
            // Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。Reflect不是一个函数对象，因此它是不可构造的。
            return Reflect.get(target, key, receiver);
        },
        set: function(target, key, value, receiver) {
            console.log(target, key, value, receiver);
            if (key !== 'length') {
                Render.change(value);
            }
            return Reflect.set(target, key, value, receiver);
        },
    });

    // 初始化
    window.onload = function() {
        Render.init(arr);
    }

    // push数字
    btn.addEventListener('click', function() {
        newArr.push(6);
    });
    ```
* Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的
* Proxy返回的是一个新对象,我们可以只操作新的对象达到目的,而Object.defineProperty只能遍历对象属性直接修改
* Proxy作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利
* 当然,Proxy的劣势就是兼容性问题,而且无法用polyfill磨平,因此Vue的作者才声明需要等到下个大版本(3.0)才能用Proxy重写


参考：

https://mp.weixin.qq.com/s/O8iL4o8oPpqTm4URRveOIA

https://juejin.im/post/6844903601416978439

https://blog.csdn.net/qq_17175013/article/details/82563437

