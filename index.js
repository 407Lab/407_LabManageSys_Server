const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('config-lite') (__dirname)
const compression = require('compression')  // 开启gzip压缩

const app = express()

app.use(bodyParser.json())  // post请求体中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  // cookie 处理中间件

app.use(compression({ threshold: 0 }))

app.listen(config.port, function() {
  console.log(`server is running at port ${config.port}`)
})
