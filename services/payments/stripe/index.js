const exportsObj = {}

const fs = require('fs')
const path = require('path')

fs
  .readdirSync(__dirname)
  .filter(file => fs.statSync(path.join(__dirname, file)).isDirectory())
  .forEach((ctrl) => {
    exportsObj[ctrl] = require(path.join(__dirname, ctrl))
  })

module.exports = exportsObj