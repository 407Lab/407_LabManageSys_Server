# 407_LabManageSys_Server
实验室管理系统服务器子系统


## 目录

* [分支说明](#分支说明)
* [安装](#安装)
* [项目结构图](#项目结构图)
* [开发进展](#开发进展)


## 分支说明

主要分为两个分支：
* master分支：稳定版本的文件代码，**请勿在通过测试前**将dev分支合并到master分支，请勿在master分支上直接做修改。
* dev分支：开发人员的开发用分支，请每次在开发前先执行`pull`操作或者`fetch`操作以获取最新的远程代码。

> 目前未严格按照该分支要求来开发， 后续会逐步采用。

## 安装

### 克隆仓库
```
$ git clone git@github.com:407Lab/407_LabManageSys_Server.git
```

### 下载依赖
```
$ cd 407_LabServer
$ npm install
// 或者cnpm i
```

### 启动mongodb
```
$ mongod
// 前提需要安装mongodb
```

### 启动项目
```
$ npm start 或者  node index.js
```

## 项目结构图
```
├── README.md
├── config
│   └── default.js  // 项目配置文件
├── index.js  // 项目入口文件
└── server
    ├── controller  
    │   └── user.js  // 用户api controller
    ├── db
    │   ├── db.js // 数据库初始化
    │   └── user.js // 用户数据
    ├── middleware
    │   ├── checkToken.js // token检验中间件
    │   └── creatToken.js // token生产中间件
    └── routes
        └── user.js // 路由

```

##开发进展

- [ ] 用户登陆
- [x] 用户注册
- [ ] 用户查询
- [ ] 用户删除
