/*
    用作web客户端的后台服务，通过broker获取下位机client publish的数据   
*/

var mqtt = require('mqtt')
var fs = require('fs')
var path = require('path')
var http = require('http').createServer(Handle)
var io = require('socket.io').listen(http)
// var Mqttclient = mqtt.connect('mqtt://104.194.91.121:1883'); // 客户端连接到服务器

//=========================================================
// Websocet Server
//=========================================================
http.listen(8081, '127.0.0.1')

function Handle(req, res) {
  fs.readFile(path.resolve(__dirname, './index.html'), function(err, data) {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading index.html')
    }
    res.writeHead(200)
    res.end(data)
  })
}

/*`
 *   socket 监听事件
 */
io.sockets.on('connection', function(socket) {
  console.log('ws连接成功')
  // 后端监听前端发过来的消息并广播给全体
  socket.on('message', function(data) {
    socket.emit('pigbed', data)
  })

  // 监听断连事件
  socket.on('disconnect', function() {
    // socket断开事件
    console.log('与前端断开ws连接')
  })
})

//=========================================================
// MQTT Server
//=========================================================
var MqttServer = function() {
  this.qtt = {}
}

var MQTT = new MqttServer() // 实例化mqtt对象

/**
 * mqtt 前台客户端连接，监听事件初始化
 */
MqttServer.prototype.Init = function() {
  var Mqttclient = mqtt.connect('mqtt://47.96.5.212', {
    port: 1883,
    clientId: 'hahahah'
  }) // 客户端连接到服务器

  Mqttclient.on('connect', function() {
    console.log('mqtt连接成功!')
    Mqttclient.subscribe('labmqtt', function(err, granted) {
      if (!err) {
        console.log('订阅信息为：', granted)
      }
    })
  })

  Mqttclient.on('message', function(topic, message) {
    console.log('接受到mqtt server 消息')
    // var recDataObj = MQTT.dataResolve(message);
    // MQTT.dataHandle(recDataObj);
  })
}

MqttServer.prototype.dataResolve = function(msg) {
  let dataObj = {}
  let Tempobj = JSON.parse(msg.toString())
  dataObj.id = Tempobj.id
  dataObj.state = Tempobj.state
  dataObj.temperature = Tempobj.temperature
  dataObj.humidity = Tempobj.humity
  dataObj.weight = Tempobj.weight
  return dataObj
}

MqttServer.prototype.dataHandle = function(msg) {
  const webTopic = 'pigbed'
  var dataStr = JSON.stringify(msg)
  io.emit(webTopic, dataStr)
}

MQTT.Init() // 初始化MQTT连接，设置监听事件
