global.__basedir = __dirname
const dotenv = require('dotenv')
dotenv.config()

const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
app.set('port', port)

require(__basedir + '/db')

const server = http.createServer(app)
server.listen(port)

const io = require('socket.io')(server)
app.io = io

io.sockets.on('connection', (socket) => {
  socket.on('joinConv', (conv) => {
    socket.join(conv)
  })
})

console.log('Started on port ' + port)