# dapingtai

> l

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


# 开发说明
站内全局变量: sessionStorage
userId:用户ID，phone：电话，appName：小程序名称，miniId，小程序Id，modelId：模板Id
获取方式 sessionStorage.getItem('userId')

#router 创建路径规范
按照houseAgent注释示例进行编码

# 项目目录的创建
找到src/appurl 创建一个对象数组，数组的名称应与项目名称相同 

# 项目创建方式
在 src/componens/目录下创建项目文件夹 
common为所有项目通用的文件
其他文件夹应为独立项目
具体示例查看houseAgent



