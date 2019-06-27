const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware()

router.get('/', (req, res, next) => { // so we use this for many purposes, filtering and different models
  const config = {}

  // TODO: move this to helpers the next time it's needed
  const { page, size, by, order } = req.query
  config.pageData = { page, size, by, order }

  const { proId, likerId, likeeId } = req.query
  config.filter = {}

  /*
    - proId: get likes for product
    - likerId: get likes by user
    - likeeId: get likes to user
  */

  if (proId || likerId || likeeId) {
    let queryPromise = null
    if (proId) {
      config.filter.proId = proId
      queryPromise = db.likes.getLikesForProduct(config)
        .then((result) => {
          const userIds = result.content
          const totalElements = result.totalElements

          return db.users.getByIds(userIds)
            .then(users => users.map((user) => ({
              id: user.id,
              avatar: user.avatar,
              username: user.username
            })))
            .then((users) => ({
              content: users,
              totalElements
            }))
        })
    } else if (likerId) {
      config.filter.usrId = likerId
      queryPromise = db.likes.getUserLikes(config)
        .then((result) => {
          const productIds = result.content
          const totalElements = result.totalElements

          return db.products.getByIds(productIds)
            .then(products => products.map((product) => ({
              id: product.id,
              title: product.title,
              images: product.images,
              price: product.price,
              currency: product.currency,
              status: product.status
            })))
            .then((products) => ({
              content: products,
              totalElements
            }))
        })
    } else if (likeeId) {
      config.filter.selId = likeeId
      queryPromise = db.likes.getLikesToUser(config)
        .then((result) => {
          const likes = result.content
          const totalElements = result.totalElements

          return new Promise((resolve, reject) => {
            const resultArr = likes.map((like) => {
              const { proId, usrId } = like

              const userPromise = db.users.getUser({ id: usrId })
              const productPromise = db.products.getProduct(proId)

              return Promise.all([userPromise, productPromise])
                .then(([user, product]) => {
                  const result = {
                    id: like.id,
                    liker: {
                      id: user.id,
                      avatar: user.avatar,
                      username: user.username
                    },
                    product: {
                      id: product.id,
                      title: product.title,
                      images: product.images,
                      status: product.status
                    },
                    createdAt: like.createdAt
                  }
                  return result
                })
                .catch(err => reject(err))
            })
            resolve(Promise.all(resultArr))
          })
          .then((likesArr) => ({
            content: likesArr,
            totalElements
          }))
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
              resolve({ status: 'liked' })
            })
            .catch((errObj) => {
              const error = (errObj && errObj.name) ? errObj.name : ''
              const isDuplicate = error === 'SequelizeUniqueConstraintError'

              if (isDuplicate) {
                resolve({ status: 'liked', msg: 'alreadyLiked', statusCode: 202 })
              } else {
                reject(errObj)
              }
            })
        } else {
          db.likes.deleteLike({ proId, usrId })
            .then(() => {
              resolve({ status: 'unliked' })
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