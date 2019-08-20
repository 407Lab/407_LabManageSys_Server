var mosca = require('mosca') //构建服务器
const http = require('http')

var config = {
  // host: '47.96.5.212',
  port: 1883
}

var msgtocli = ''

http
  .createServer(function(req, res) {
    res.write(msgtocli)
    res.end()
  })
  .listen('8082')

var MqttServer = new mosca.Server(config)

// 监听连接
MqttServer.on('clientConnected', function(client) {
  console.log('client connected  id is:', client.id)
})

MqttServer.on('ready', function() {
  console.log('mqtt is running at port ', config.port)
})

// 监听主题消息
MqttServer.on('published', function(packet, client) {
  //当客户端有连接的时候，发布主题消息
  var topic = packet.topic
  // var clientId = client.id;   // 客户端id
  console.log('接收到publish： ', packet, '\r\n')
  console.log('===============================')
  let objnew = JSON.parse(JSON.stringify(packet))
  msgtocli = resendMsg(packet)
  // console.log(JSON.parse(objnew.payload))
  // let realTopic = JSON.parse(packet.payload)
  // let realTopic = JSON.parse(packet.payload)
  // console.dir(JSON.parse(packet.payload))
  // const resBody = JSON.parse(JSON.stringify(packet.payload))
  // let resa =  JSON.parse(resBody)
  // console.log('res body', resBody, typeof resBody.payload)
  // console.log('zzw', JSON.parse(JSON.stringify(packet.payload)))
  // console.log(JSON.parse(`'${packet.payload}'`))
  switch (topic) {
    case 'dev/pigbed': // 下位机订阅的主题监听并转发
      // forwardMcuData(getMcuData(packet));
      break

    case '$SYS/VnsOq3R/new/clients':
      console.log('下位机已经连接')
      break
    case '$SYS/Zz7FEUD/new/subscribes': //   labmqtt
      console.log('mqtt测试连接!!')
      send2Mcu()
      break

    default:
      // send2Mcu()
      console.log('未知订阅发来的消息!')
      break
  }
})

//=========================================================
// getway Handle functions
//=========================================================

function getMcuData(packet) {
  let forwardData = {
    topic: 'web/pigbed',
    payload: packet.payload,
    qos: 0,
    retain: false
  }
  console.log('luta data  payload is: ', packet.payload.toString())
  return forwardData
}

function forwardMcuData(pigBedData) {
  MqttServer.publish(pigBedData, function() {
    console.log('发送给前端web/pigbed订阅了')
    // 后续可存入数据库
  })
}

function send2Mcu() {
  let forwardData = {
    topic: 'labmqtt',
    payload: { name: 'zzw' },
    qos: 0,
    retain: false
  }
  MqttServer.publish(forwardData, function() {})
}

function resendMsg(conmsg) {
  return JSON.stringify(conmsg)
}
