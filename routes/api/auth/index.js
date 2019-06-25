const router = require('express').Router()

const login = require(__basedir + '/services/auth').login

router.post('/login', login)

module.exports = router