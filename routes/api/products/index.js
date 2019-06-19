const router = require('express').Router()

const uploadMdw = require(__basedir + '/helpers').uploadMdw
const db = require(__basedir + '/db/controllers')

router.get('/', (req, res) => {
  return db.products.getProducts()
    .then(products => res.send(products))
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return db.products.getProduct(id)
    .then((product) => {
      if (!product)
        throw { status: 404, msg: 'notFound' }
      return res.send(product)
    })
    .catch(err => next(err))
})

router.post('/', (req, res, next) => {
  const product = req.body
  const userId = req.user.id
  
  product.selId = userId
  return db.products.insertProduct(product)
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.post('/:id/images', uploadMdw.single('productImage'), (req, res, next) => {
  const productId = req.params.id
  const productImageFile = req.file

  if (!productId)
    throw { status: 400, msg: 'invalidProduct' }
  if (!productId || !productImageFile)
    throw { status: 400, msg: 'invalidImage' }

  return db.products.getProduct(productId)
    .then((product) => {
      if (!product)
        throw { status: 404, msg: 'invalidProduct' }

      const productImage = {
        url: productImageFile.filename,
        proId: productId
      }

      return db.images.insertImage(productImage)
        .then(result => res.send(result))
        .catch(err => next(err))
    })
})

module.exports = router