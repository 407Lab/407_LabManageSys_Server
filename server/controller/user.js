const express = require('express')
const Model = require('../db/user')
const sha1 = require('sha1')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/creatToken')
const checkToken = require('../middleware/checkToken')
const moment = require('moment')

/**
 * @api {post} /api/user/register 用户注册
 * @apiDescription 用户注册
 * @apiName user-register
 * @apiGroup User
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiSuccessExample {json} 响应示例:
 *  {
 *      "data": {
 *        "code": 200,
 *        "msg": "xxxxx",
 *        "success": true,
 *        "result": {}
 *       }
 *  }
 * @apiSampleRequest http://localhost:8082/api/user/register
 * @apiVersion 1.0.0
 */
const Register = (req, res) => {
  // 获取注册信息，并生成user数据模型
  let userRegister = new Model.User({
    username: req.body.username,
    password: sha1(req.body.password),
    specialities: req.body.specialities,
    grade: req.body.grade,
    lab: req.body.lab,
    skills: req.body.skills,
    roles: ['admin'],
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    token: createToken(this.username)
  })

  // 将 objectid 转换为 用户创建时间
  userRegister.create_time = moment(
    objectIdToTimestamp(userRegister._id)
  ).format('YYYY-MM-DD HH:mm:ss')

  Model.User.findOne(
    {
      username: userRegister.username.toLowerCase()
    },
    (err, doc) => {
      console.log(doc)
      if (err) throw err
      // 如果用户已经存在， 则不能注册
      if (doc) {
        res.json({
          data: {
            code: 201,
            msg: '用户名已存在',
            success: false,
            result: {}
          }
        })
      } else {
        userRegister.save(err => {
          if (err) return
          res.json({
            data: {
              code: 200,
              msg: '注册成功',
              success: true,
              result: {}
            }
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
  console.log(userLogin, 'login!!') // 登陆token变化 数据库应该修改呀 老歌
  const update = { $set: { token: userLogin.token } }
  Model.User.findOne({ username: userLogin.username }, (err, doc) => {
    // doc 是原先数据库中存取的数据  userlogin对象是登陆获取到的数据
    if (err) throw Error(err)
    if (!doc) {
      res.json({
        data: {
          code: 201,
          msg: '该账户不存在',
          success: false,
          result: null
        }
      })
    } else if (userLogin.password === doc.password) {
      // 更新token
      Model.User.updateOne({ username: userLogin.username }, update, err => {
        if (err) {
          console.error(err)
          throw Error(err)
        } else {
          res.json({
            data: {
              code: 200,
              success: true,
              msg: '登陆成功!',
              result: {
                username: doc.username,
                time: moment(objectIdToTimestamp(doc._id)).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                token: userLogin.token
              }
            }
          })
        }
      })
    } else {
      console.warn('密码错误')
      res.json({
        data: {
          code: 400,
          success: false,
          msg: '密码错误',
          result: null
        }
      })
    }
  })
}

/**
 * 用户删除接口
 */
const DelUser = (req, res) => {
  Model.User.findOneAndDelete({ _id: req.body.id }, (err, doc) => {
    if (err) throw err
    if (!doc) {
      res.json({
        data: {
          code: 201,
          msg: '该用户不存在,无法删除',
          success: false,
          result: null
        }
      })
    } else {
      res.json({
        data: {
          code: 200,
          success: true,
          msg: '用户删除成功',
          result: null
        }
      })
    }
  })
}

/**
 * 用户查询接口 (查询所有用户列表)
 */
const listAllUser = (req, res) => {
  Model.User.find({}, (err, doc) => {
    if (err) throw err
    if (doc) {
      res.json({
        data: {
          result: doc,
          code: 200,
          success: true,
          msg: '获取用户列表成功'
        }
      })
    } else {
      res.json({
        data: {
          code: 400,
          success: false,
          msg: '获取用户信息失败'
        }
      })
    }
  })
}

/**
 * 获取用户信息
 */
const getUserInfo = (req, res) => {
  Model.User.findOne({ token: req.body.token }, (err, doc) => {
    console.log('userinfo', doc)
    if (!doc) {
      res.json({
        data: {
          code: 400,
          success: false,
          msg: '获取用户信息失败!'
        }
      })
    } else {
      res.json({
        data: {
          code: 200,
          success: true,
          msg: '获取用户信息成功!',
          result: {
            roles: ['admin'],
            username: doc.username,
            avatar:
              doc.avatar ||
              'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          }
        }
      })
    }
  })
}

module.exports = router => {
  router.post('/user/register', Register),
    router.post('/user/login', Login),
    router.post('/user/deluser', checkToken, DelUser),
    router.post('/user/userlist', checkToken, listAllUser),
    router.post('/user/getUserInfo', checkToken, getUserInfo)
}
