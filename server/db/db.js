/**
 * 负责mongodb的初始化
 * 挂载监听事件
 * 暴露出mongose对象
 */

const config = require('config-lite')(__dirname)
const mongoose = require('mongoose')

mongoose.connect(config.mongodb, { useNewUrlParser: true }) // 🔗mongodb

/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
  console.log(`connected to ${config.mongodb} successfully 🎉`)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
  console.error('Mongoose connection error: ' + err)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
  console.log('mongoose connection disconnected')
})

module.exports = mongoose
