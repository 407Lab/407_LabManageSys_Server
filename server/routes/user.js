const express = require('express')
const router = express.Router()
const UserController = require('../controller/user.js') // 引入用户控制器


UserController(router)  // 将用户api挂载到路由上

module.exports = router // 导出路由
