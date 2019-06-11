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
    .then((shippingInfo) => {
      res.send(shippingInfo)
    })
})

router.post('/user/shippingInfo', authMiddleware, (req, res) => { // TODO: move this
  const userId = req.user.id
  const data = req.body

  return db.shippingInfos.getShippingInfoForUser(userId) // TODO: maybe compare user ids here
    .then((shippingInfo) => {
      const { id } = shippingInfo
      const shippingInfoObj = {
        id,
        ...data
      }
      return db.shippingInfos.updateShippingInfo(shippingInfoObj)
        .then((result) => {
          return res.send({ status: 'success' })
        })
    })
})

router.post('/login', login)

module.exports = router