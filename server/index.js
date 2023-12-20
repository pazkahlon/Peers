const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

//const cors = require("cors")
const router = require('./router')

//app.use(cors())
app.use(router)

const Sockets = require('./sockets')

const socketServer = new Sockets(io)

socketServer.init()

server.listen(process.env.SOCKET_PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.SOCKET_PORT || 5000}`)
})

module.exports = app
