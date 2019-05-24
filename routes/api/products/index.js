const router = require('express').Router()

const db = require(__basedir + '/db/controllers')

router.get('/', function(req, res) {
  return db.products.getProducts()
    .then(products => res.send(products))
    .catch(err => next(err))
})

router.get('/:id', function(req, res, next) {
  const id = req.params.id
  return db.products.getProduct(id)
    .then((product) => {
      if (!product) return next({ status: 404, msg: 'notFound' })
      return res.send(product)
    })
    .catch(err => next(err))
})

module.exports = router