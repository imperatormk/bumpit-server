const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware

router.get('/', (req, res, next) => { // so we use this for many purposes, filtering and different models
  const { proId, likerId, likeeId } = req.query

  /*
    - proId: get likes for product
    - likerId: get likes by user
    - likeeId: get likes to user
  */

  if (proId || likerId || likeeId) {
    let queryPromise = null
    if (proId) {
      queryPromise = db.likes.getLikesForProduct(proId)
    } else if (likerId) {
      queryPromise = db.likes.getUserLikes(likerId)
    } else if (likeeId) {
      queryPromise = db.likes.getLikesToUser(likeeId)
    } else {
      queryPromise = Promise.reject({ status: 400, msg: 'invalidParams' })
    }

    return queryPromise
      .then(results => res.send(results))
      .catch(err => next(err))
  }
  return next({ status: 400, msg: 'invalidParams' })
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