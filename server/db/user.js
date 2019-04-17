/**
 * 定义mongose中的表结构
 */
const mongoose = require('./db')

/**
 * 用户登录表结构
 */
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  recheck: String,
  token: String,
  create_time: Date
})

/**
 * 数据模型， 用于对数据库进行操作
 */
const model = {
  User: mongoose.model('User', userSchema)
}

module.exports = model
