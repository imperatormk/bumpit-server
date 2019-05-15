const express = require('express')
const router = express.Router()
const authMiddleware = require(__basedir + '/services/auth').middleware
const login = require(__basedir + '/services/auth').login

router.get('/user', authMiddleware, (req, res) => {
  return res.json({
    user: req.user
  })
})

router.post('/login', login)

module.exports = router