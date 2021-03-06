/**
 * 创建 token
 * token 单点登录具体理解： http://www.tuicool.com/articles/uuAzAbU
 */

const jwt = require('jsonwebtoken')
const secretOrPrivateKey = 'secret'

module.exports = function(name) {
  const token = jwt.sign(
    {
      name: name
    },
    secretOrPrivateKey,
    { expiresIn: 60*5 }
  )
  return token
}
