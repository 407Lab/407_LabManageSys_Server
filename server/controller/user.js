const express = require('express')
const Model = require('../db/user')
const sha1 = require('sha1')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/creatToken')
const checkToken = require('../middleware/checkToken')
const moment = require('moment')

/**
 * 用户注册接口
 */
const Register = (req, res) => {
  // 获取注册信息，并生成user数据模型
  let userRegister = new Model.User({
    username: req.body.username,
    password: sha1(req.body.password),
    recheck: req.body.recheck,
    token: createToken(this.username)
  })

  // 将 objectid 转换为 用户创建时间
  userRegister.create_time = moment(objectIdToTimestamp(userRegister._id)).format(
    'YYYY-MM-DD HH:mm:ss'
  )

  Model.User.findOne(
    {
      username: userRegister.username.toLowerCase()
    },
    (err, doc) => {
      if (err) console.error(err)
      // 如果用户已经存在， 则不能注册
      if (doc) {
        res.json({
          msg: '用户名已存在',
          success: false
        })
      } else {
        userRegister.save(err => {
          if (err) console.error(err)
          res.json({
            msg: '注册成功',
            success: true
          })
        })
      }
    }
  )
}

module.exports = router => {
  router.post('/register', Register)
}
