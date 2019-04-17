/**
 * 监测 token 是否过期
 */

const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  console.log('this is token watch', req.headers)
  let token = req.headers['authorization'].split(' ')[1]
  console.log('tokens', token)
  // 解构 token，生成一个对象 { name: xx, iat: xx, exp: xx }
  let decoded = jwt.decode(token, 'secret')
  if (token && decoded.exp <= Date.now() / 1000) {
    return res.json({
      code: 401,
      message: 'token过期，请重新登录'
    })
  }
  next()
}
