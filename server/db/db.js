/**
 * 负责mongodb的初始化
 * 挂载监听事件
 * 暴露出mongose对象
 */

const config = require('config-lite')(__dirname)
const mongoose = require('mongoose')
let connectTimer = undefined

mongoose.connect(config.mongodb, { useNewUrlParser: true }) // 🔗mongodb

/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
  console.log(
    `Congratulations 🎉 💐 connected to ${config.mongodb} successfully 🎉`
  )
  clearTimeout(connectTimer)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
  console.error('Mongoose connection error: ' + err)
  // 连接不成功时进行重复连接
  reConnect()
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
  console.log('mongoose connection disconnected')
  reConnect()
})

/*
 * 数据库重连
 */
function reConnect() {
  connectTimer = setTimeout(() => {
    mongoose.connect(config.mongodb, { useNewUrlParser: true })
  }, 5000)
}

module.exports = mongoose
