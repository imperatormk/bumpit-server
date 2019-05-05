const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
app.use(logger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

module.exports = app