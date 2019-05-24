const router = require('express').Router()

const registerService = require(__basedir + '/services/accounts').register

router.post('/register', (req, res, next) => {
  const user = req.body
  return registerService(user)
    .then(user => res.send(user))
    .catch(err => next(err))
})

module.exports = router