const exportsObj = {}

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && (file !== basename) && (file !== 'provider.js') && (file.slice(-3) === '.js'))
  .forEach((ctrl) => {
    const ctrlName = ctrl.slice(0, -3)
    exportsObj[ctrlName] = require(path.join(__dirname, ctrlName))
  })

module.exports = exportsObj