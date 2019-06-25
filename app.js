const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')

require('./passport')
const routes = require('./routes')

const app = express()
app.use(logger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(passport.initialize())

const force200Responses = (req, res, next) => {
  req.headers['if-none-match'] = 'no-match-for-this'
  next()
}
app.use(force200Responses)

app.use('/', routes)

module.exports = app