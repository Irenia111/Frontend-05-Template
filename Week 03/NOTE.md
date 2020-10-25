## 四则运算的定义
1. 词法定义

Token
    Number: 1 2 3 4 5 6 7 8 9 0 的组合
    Operator: + 、-、 *、 / 之一
Whitespace: &lt;sp&gt;
LineTerminator：&lt;LF&gt;  &lt;CR&gt;

2. 运算语法定义
加减乘除有优先级，所以可以认为**加法**是由**若干个乘法**再由加号或者减号连接成
```
<Expression> ::=     
    <AdditiveExpression><EOF>
<AdditiveExpression> ::=     
    <MultiplicativeExpression>    
    |<AdditiveExpression><+><MultiplicativeExpression>    
    |<AdditiveExpression><-><MultiplicativeExpression>
```
普通数字也得当成乘法的一种特例
```
<MultiplicativeExpression> ::=     
    <Number>    
    |<MultiplicativeExpression><*><Number>    
    |<MultiplicativeExpression></><Number>
```
## 词法分析 将输入字符串流变为token
1. 状态机
2. 正则

## 语法分析  将token变成抽象语法树
LL 语法分析根据每一个产生式来写一个函数，每个产生式对应着一个函数，例如：根据产生式，我们的 AdditiveExpression 需要处理三种情况：
```
<AdditiveExpression> ::=     
    <MultiplicativeExpression>    
    |<AdditiveExpression><+><MultiplicativeExpression>    
    |<AdditiveExpression><-><MultiplicativeExpression>
```
下一步我们就把解析好的 token 传给我们的顶层处理函数 Expression

我们 Expression 收到第一个 token，是个 Number，这个时候，Expression 就傻了，这是因为产生式只告诉我们，收到了 AdditiveExpression 怎么办。

这个时候，我们就需要对产生式的首项层层展开，根据所有可能性调用相应的处理函数，这个过程在编译原理中称为求“closure”。

## 解释执行  后序遍历AST，执行得出结果

得到了 AST 之后，最困难的一步我们已经解决了。这里我们就不对这颗树做任何的优化和精简了，那么接下来，直接进入执行阶段。我们只需要对这个树做遍历操作执行即可。