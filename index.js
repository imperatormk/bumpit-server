const dotenv = require('dotenv')
dotenv.config()

const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
console.log('started on port ' + port)