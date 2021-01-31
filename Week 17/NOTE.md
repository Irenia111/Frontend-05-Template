# Yeoman 框架生成器

## 使用步骤：

1. 初始化 npm `npm init -y`
2. 安装`yeoman-generator`依赖
3. 创建`generators/app/index.js`文件
4. 执行`npm link`进行软链

## 使用细节

1. 获取用户输入

```js
this.prompt([
{
type: 'input', // 用户输入
name: 'name',
message: '项目的名称？',
default: this.appname,
},
{
type: 'confirm', // 用户确认
name: 'cool',
message: '我帅吗？',
},
]);
```

- type:
- input 用户输入
- confirm 用户确认，会出现 Y/n 供用户选择

2. 管理依赖

```js
const pkgJson = {
devDependencies: {
eslint: '^3.15.0',
},
dependencies: {
react: '^16.2.0',
},
};

// 生成package.json文件
this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
// 使用yarn进行依赖安装
this.yarnInstall();
```

3. 文件系统，负责生成模板文件

```js
this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('public/index.html'), {
title: this.answers.name,
});
```

- 需要注意要在 app 文件下创建对应的 templates 文件夹



