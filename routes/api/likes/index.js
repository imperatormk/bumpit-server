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
        .then(userIds => db.users.getByIds(userIds))
        .then((users) => {
          return users.map((user) => ({
            avatar: user.avatar,
            username: user.username
          }))
        })
    } else if (likerId) {
      queryPromise = db.likes.getUserLikes(likerId)
        .then(productIds => db.products.getByIds(productIds))
        .then((products) => {
          return products.map((product) => ({
            title: product.title,
            images: product.images
          }))
        })
    } else if (likeeId) {
      queryPromise = db.likes.getLikesToUser(likeeId)
        .then((likes) => {
          return new Promise((resolve, reject) => {
            const resultArr = likes.map((like) => {
              const { proId, usrId } = like

              const userPromise = db.users.getUser({ id: usrId })
              const productPromise = db.products.getProduct(proId)

              return Promise.all([userPromise, productPromise])
                .then(([user, product]) => [user.toJSON(), product.toJSON()])
                .then(([user, product]) => {
                  const result = {
                    liker: {
                      avatar: user.avatar,
                      username: user.username
                    },
                    product: {
                      title: product.title,
                      images: product.images
                    },
                    createdAt: like.createdAt
                  }
                  return result
                })
                .catch(err => reject(err))
            })
            resolve(resultArr)
          })
          .then(promiseArr => Promise.all(promiseArr))
        })
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