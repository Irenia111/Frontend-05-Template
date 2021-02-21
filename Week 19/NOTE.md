## 发布系统流程

### 1、构建线上web服务
使用express或者koa，开启web server服务
### 2、构建发布系统服务
发布系统服务主要作用是将开发好的前端静态资源，传输到web服务；该过程一般为多文件传输，课程中采用archiver压缩，然后用unzipper解压，达到多文件传输；
### 3、开发发布工具
发布工具主要是把开发好的前端静态资源文件当作参数传给构建发布系统服务，由构建发布系统服务接受到文件后发送到web服务；
### 4、鉴权校验
注册github app，获取Client ID和Client secrets

https://docs.github.com/en/developers/apps/authorizing-oauth-apps

打开https://github.com/login/oauth/authorize 【publish】
auth 路由： 接收code， 用code+client_id+client_secret换token 【server】
创建server， 接受token， 点击发布 【publish】
publish路由：用token获取用户信息，检查权限，接受发布 【server】