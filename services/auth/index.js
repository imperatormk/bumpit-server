const exportsObj = {}
const login = require('./login')
const middleware = require('./middleware')

exportsObj.login = login
exportsObj.middleware = middleware
module.exports = exportsObj