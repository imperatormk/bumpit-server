const express = require('express')
const router = express.Router()

const apiRoutes = require('./api')
const authMiddleware = require(__basedir + '/services/auth').middleware
const login = require(__basedir + '/services/auth').login

let startDate = new Date()

router.get('/', (req, res) => {
  return res.json({
    sane: true,
	  startDate
  })
})

router.get('/protected', authMiddleware, (req, res) => {
  return res.json({
    auth: true,
    user: req.user
  })
})

router.post('/login', login)

router.use('/api', apiRoutes)

module.exports = router