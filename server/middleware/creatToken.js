/**
 * 创建 token
 * token 单点登录具体理解： http://www.tuicool.com/articles/uuAzAbU
 */

const jwt = require('jsonwebtoken')

module.exports = function(name) {
  const token = jwt.sign(
    {
      name: name
    },
    'secret',
    { expiresIn: '30s' }
  )
  return token
}
