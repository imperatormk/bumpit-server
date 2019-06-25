const router = require('express').Router()

const db = require(__basedir + '/db/controllers')

const authMiddleware = require(__basedir + '/services/auth').middleware

const uploadMiddleware = require(__basedir + '/helpers').uploadMiddleware

router.get('/', authMiddleware, (req, res, next) => {
  const user = JSON.parse(JSON.stringify(req.user))
  const { includeSettings } = req.query
  const settingsPromise = !!includeSettings ? db.users.getUserSettings(user.id) : Promise.resolve()
  return settingsPromise
    .then((userSettings) => {
      const userObj = { ...user }
      if (userSettings) userObj.settings = { ...userSettings }
      return res.send(userObj)
    })
    .catch(err => next(err))
})

router.post('//settings', authMiddleware, (req, res, next) => {
  const settings = req.body
  return db.users.updateUserSettings(req.user.id, settings)
    .then(result => res.json(result))
    .catch(err => next(err))
})

router.get('//shippingInfo', authMiddleware, (req, res) => { // TODO: move this
  const userId = req.user.id
  return db.shippingInfos.getShippingInfoForUser(userId)
    .then((shippingInfo) => {
      res.send(shippingInfo)
    })
    .catch(err => next(err))
})

router.post('//shippingInfo', authMiddleware, (req, res, next) => { // TODO: move this
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
        .then(() => {
          return res.send({ status: 'success' })
        })
    })
    .catch(err => next(err))
})

router.post('//avatar', authMiddleware, uploadMiddleware('avatars').single('avatar'), (req, res, next) => {
  const userId = req.user.id
  const avatar = req.file.filename

  return db.users.updateAvatar(userId, avatar)
    .then((avatar) => res.json({ avatar }))
    .catch(err => next(err))
})

module.exports = router