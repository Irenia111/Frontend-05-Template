## 运算符 Atom & 表达式 Expression
```js
new new Foo()
// new (new Foo())
new Foo()()
// (new Foo)() 

3 ** 2 ** 3
// 3 ** (2 ** 3)

++ a ++
// 无法运行，但结合顺序：++（a ++）
```

## 语句 Statement
### 复合语句
* 语句块 BlockStatement
  * let/coonst 声明，仅仅对语句块作用域生效
* 流程控制
  * IfStatement
  * SwitchStatement
* 循环语句
  * IterationStatement 
  * WithStatement
* LabelledStatement 配合循环、跳出语句使用
* TryStatement ```try catch```语句

### 简单语句
* 声明语句 ExpressionStatement
  * 函数声明
    * FunctionDeclaration 函数体内，预处理阶段，默认提升到运行时第一句执行
    * GeneratorDeclaration
    * AsyncFunctionDeclaration
    * AsyncGeneratorDeclaration
  * 变量声明
    * VariableStatement 
      * VariableEnvironment 不会被块级作用域限制，直接绑定在函数体
      * 函数体内，默认提升到运行时第一句执行 
  
    * ClassDeclaration LexicalDeclaration
      * LexicalEnvironment 会被块级作用域限制，直接绑定在块级作用域
      * let const class 会在预处理阶段在函数体内提升，但有在 LexicalEnvironment，无法在定义前使用
      * for 循环在 for 的括号内开辟了新的作用域，使得 let 定义的变量不会提升至外部
* 空语句 EmptyStatement
* 调试断点 DebuggerStatement 
* ThrowStatement ```try catch```
* ContinueStatement 
* BreakStatement 循环终止
* ReturnStatement 跳出，但无法跳出```try catch```
  
## 运行时
### 事件循环
### 执行环境 Execution Context
* ECMAS Code Execution Context
  * code evaluation state
  * Function
    * 函数会被提升
    * 闭包 closure 记录当前函数的执行环境
  * Script or Module
    * 从外界引入的模块，也会记录模块所在的执行环境
  * Realm
    * 保存了全部对象的记录
  * LexicalEnvironment
    * this/ new.target/ super/ let&const 定义的变量
  * VariableEnvironment
* Generator Execution Context
  * code evaluation state
  * Function
  * Script or Module
  * Realm
  * LexicalEnvironment
  * VariableEnvironment
  * Generator