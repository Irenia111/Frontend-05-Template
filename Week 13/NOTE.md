## 重要的HTML实体（DTD）
* nbsp 在网页上出现多个空格，会出现分词的问题
* quot 是双引号
* amp 是&符
* lt 是小于号
* gt 是大于号

## HTML标签语义
* `<main></mian> `放的主要部分 表示一个
* `<hgroup></hgroup>` 标题组
* `<abbr></abbr>`表示缩写、简写 有title属性
* `<strong></strong>` 表示重点 文章的重点
* `<em></em>` 表示强调 语气上
* `<figure></figure>` 用作文档中插图的图像
* `<figcaption></figcaption>` 元素为 figure 添加标题
* `<nav></nav>` nav 标签定义导航链接的部分。
* `<dfn></dfn>` dfn表示定义当前的词
* `<samp></samp>`表示例子
* `<pre></pre>` 表示引入代码
* `<code></code>` 代码


## 合法元素
* Element: `<tagname>...</tagname>`
* Text: text
* Comment: `<!-- comments -->`
* DocumentType: `<!Doctype html>`
* ProcessingInstruction: `<?a 1?>`
* CDATA:`<![CDATA[ ]]>`

## 浏览器API
### Range API

* var range = new Range()
* range.setStart(element,9) 对于element的偏移值是children,对于text的偏移值是文字的个数 如果选中了半个节点并删除，浏览器会自己补上半个节点
* range.setEnd(element,4)
* var range = document.getSelection().getRangeAt(0);
* 方法
  * range.setStartBefore
  * range.setEndBefore
  * range.setStartAfter
  * range.setEndAfter
  * range.selectNode
  * range.selectNodeContents 选中一个元素所有的内容
* var fragment = range.extractContents()
  range选取的内容从DOM树摘下来，fragment是node的一个子类，它在append的时候，它自己不会append到dom树上，对fragment的dom操作不会影响真实的dom，最后append的时候它会把它的所有的子节点代替它自己放上去。fragment不需要发生重排，它的性能比较高。
* range.insertNode(document.createTexdNode("aaa"))

## CSSOM
CSSOM View
### Window
* window.innerHeight,window.innerWidth
* viewport,浏览实际渲染的宽度和高度
* window.outerWidth,window.outerHeight
* window.devicePixelRatio
* window.screen
  * window.screen.width
  * window.screen.height
  * window.screen.availWidth
  * window.screen.availHeight

### Window API
* window.open("about:blank","_blank","width=100,height=100,left=100,right=100")
* moveTo(x,y)
* moveBy(x,y)
* resizeTo(x,y)
* resizeBy(x,y)

### scroll
只有在有滚动条的时候，这些API才会生效
* scrollTop
* scrollLeft
* scrollHeight
* scrollWidth
* scroll(x,y)
* scrollBy(x,y)
* scrollIntoView()
* window
    * scrollX
    * scrollY
    * scrollTo(x,y)
    * scrollBy(x,y)

### layout
* getClientRects()
* getBoundingClientRect()
