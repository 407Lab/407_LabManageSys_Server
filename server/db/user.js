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
  specialities: String,
  grade: String,
  lab: String,
  skills: String,
  roles: Array,
  avatar: String,
  token: String,
  create_time: Date,
  uid: String
})

/**
 * 数据模型， 用于对数据库进行操作
 */
const model = {
  User: mongoose.model('User', userSchema)
}

module.exports = model
