const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware

router.get('/:proId', (req, res, next) => {
  const proId = req.params.proId

  return db.likes.getLikesForProduct(proId)
    .then((likes) => {
      return res.send(likes)
    })
    .catch(err => next(err))
})

router.post('/:proId', authMiddleware, (req, res, next) => {
  const usrId = req.user.id
  const proId = req.params.proId
  const { action } = req.body

  const allowedActions = ['like', 'unlike']
  if (!allowedActions.includes(action))
    return next({ status: 400, msg: 'invalidAction' })

  return db.products.getProduct(proId)
    .then((product) => {
      if (!product)
        throw { status: 400, msg: 'badProduct' }
      const actionProm = new Promise((resolve, reject) => {
        if (action === 'like') {
          db.likes.insertLike({ proId, usrId })
            .then(() => {
              resolve({ status: 'success' })
            })
            .catch((errObj) => {
              const error = (errObj && errObj.name) ? errObj.name : ''
              const isDuplicate = error === 'SequelizeUniqueConstraintError'

              if (isDuplicate) {
                resolve({ status: 'failed', msg: 'alreadyLiked', statusCode: 202 })
              } else {
                reject(errObj)
              }
            })
        } else {
          db.likes.deleteLike({ proId, usrId })
            .then(() => {
              resolve({ status: 'success' })
            })
        }
      })
      return actionProm
        .then((result) => {
          const statusCode = result.statusCode || 200
          const respBody = {
            status: result.status
          }
          if (result.msg) respBody.msg = result.msg
          res.status(statusCode).send(respBody)
        })
    })
    .catch(err => next(err))
})

module.exports = router