/**
 * 监测 token 是否过期
 */

const jwt = require('jsonwebtoken')
const secretOrPrivateKey = 'secret'

module.exports = function(req, res, next) {
  // ===  is token in header？  ===//
  if (!req.headers['authorization']) {
    return res.json({
      msg: '用户未登录',
      code: 400
    })
  }

  //=== token verify ===//
  let token = req.headers['authorization'].split(' ')[1] || ''
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {
      res.json({
        msg: 'token过期或无效，请确认重新登陆重新登录',
        success: false
      })
    } else {
      next()
    }
  })
}
