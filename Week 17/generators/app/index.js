var Generator = require('yeoman-generator');

module.exports = class extends (
  Generator
) {
  constructor(args, opts) {
    super(args, opts);
  }
  /**
   * 第一步：获取用户输入
   */
  async getPrompt() {
    this.answers = await this.prompt([
      {
        type: 'input', // 用户输入
        name: 'name',
        message: '项目的名称？',
        default: this.appname,
      },
    ]);
  }
  /**
   * 管理依赖
   */
  initDependecies() {
    const pkgJson = {
      name: this.answers.name,
      version: '1.0.0',
      main: 'main.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: '',
      license: 'ISC',
      description: '',
      dependencies: {},
    };
    // 生成package.json文件
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    // 使用yarn进行依赖安装
    this.yarnInstall(['vue'], { dev: false });
    this.yarnInstall(
      [
        'webpack',
        'webpack-cli',
        'vue-template-compiler',
        'copy-webpack-plugin',
        'vue-loader',
        'vue-style-loader',
        'css-loader',
      ],
      { dev: true }
    );
  }

  /**
   * 第二步创建模板文件
   */
  initFiles() {
    // 写入模板文件
    this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('src/index.html'), {
      title: this.answers.name,
    });
    // 写入初始化vue文件
    this.fs.copyTpl(this.templatePath('HelloWord.vue'), this.destinationPath('src/HelloWord.vue'));
    // 写入主入口文件
    this.fs.copyTpl(this.templatePath('main.js'), this.destinationPath('src/main.js'));
    // 写入webpack配置文件
    this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'));
  }
};
