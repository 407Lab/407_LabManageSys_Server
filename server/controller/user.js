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

/**
 * 用户登陆接口
 */
const Login = (req, res) => {
  let userLogin = new Model.User({
    username: req.body.username,
    password: sha1(req.body.password),
    token: createToken(this.username)
  })
  Model.User.findOne({ username: userLogin.username }, (err, doc) => {
    // doc 是原先数据库中存取的数据  userlogin对象是登陆获取到的数据
    if (err) console.error(err)
    if (!doc) {
      console.log('账户不存在')
      res.json({
        msg: '该账户不存在',
        success: false
      })
    } else if (userLogin.password === doc.password) {
      console.log('登陆成功', doc)
      res.json({
        success: true,
        username: doc.username,
        time: moment(objectIdToTimestamp(doc._id)).format('YYYY-MM-DD HH:mm:ss'),
        token: userLogin.token
      })
    } else {
      console.warn('密码错误')
      res.json({
        success: false,
        msg: '密码错误'
      })
    }
  })
}

module.exports = router => {
  router.post('/register', Register), router.post('/login', Login)
}
