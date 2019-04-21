const express = require('express')
const bodyParser = require('body-parser') // post请求body解析
const cookieParser = require('cookie-parser') // cookie解析
const config = require('config-lite')(__dirname) // 全局配置
const compression = require('compression') // 开启gzip压缩
const routes = require('./server/routes/user')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(compression({ threshold: 0 }))
app.use('/api', routes)

app.use(function(req, res, next) {
  var err = new Error('404 not found')
  err.status = 404
  next(err)
})

app.listen(config.port, function() {
  console.log(`server is running at port ${config.port}`)
})
