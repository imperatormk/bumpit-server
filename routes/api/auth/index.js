const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware
const login = require(__basedir + '/services/auth').login

router.get('/user', authMiddleware, (req, res) => {
  return res.send(req.user)
})

router.get('/user/shippingInfo', authMiddleware, (req, res) => { // TODO: move this
  const userId = req.user.id
  return db.shippingInfos.getShippingInfoForUser(userId)
    .then((shippingInfos) => {
      res.send(shippingInfos)
    })
})

router.post('/login', login)

module.exports = router