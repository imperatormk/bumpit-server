const router = require('express').Router()

const uploadMiddleware = require(__basedir + '/helpers').uploadMiddleware
const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')

const processQueryParams = (query = {}) => {
  const config = {}

  // TODO: move this to helpers the next time it's needed
  const { page, size, by, order } = query
  config.pageData = { page, size, by, order }

  const filter = {}
  const filterKeys = Object.keys(query).filter(key => !['page', 'size', 'by', 'order'].includes(key))
  filterKeys.forEach(key => filter[key] = query[key])

  Object.keys(filter)
    .forEach((key) => {
      const val = filter[key]
      const newVal = !isNaN(Number(val)) ? Number(val) : val
      filter[key] = newVal
    })
  config.filter = filter

  return config
}

router.get('/', (req, res, next) => {
  const config = processQueryParams(req.query)

  return db.products.getProducts(config)
    .then(products => res.send(products))
    .catch(err => next(err))
})

router.get('/following', authMiddleware({ optional: true }), (req, res, next) => {
  const userId = req.user.id
  const config = processQueryParams(req.query)

  return db.products.getProductsByFollowees(config, userId)
    .then(products => res.send(products))
    .catch(err => next(err))
})

router.get('/:id', authMiddleware({ optional: true }), (req, res, next) => {
  const id = req.params.id
  const { user } = req

  return db.products.getProduct(id)
    .then((product) => {
      if (!product)
        throw { status: 404, msg: 'notFound' }
      return product.toJSON()
    })
    .then((product) => {
      if (!user) return res.send(product)

      return db.likes.isLikedByUser(product.id, user.id)
        .then((isLikedByUser) => ({
          ...product,
          likedByMe: isLikedByUser
        }))
        .then(product => res.send(product))
    })
    .catch(err => next(err))
})

router.post('/', authMiddleware(), (req, res, next) => {
  const product = req.body
  const seller = req.user
  
  product.price = product.price * 100 // convert to cents
  product.selId = seller.id
  product.location = seller.location

  return db.products.insertProduct(product)
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.post('/:id/images', authMiddleware(), uploadMiddleware('productImages').single('productImage'), (req, res, next) => {
  const productId = req.params.id
  const productImageFile = req.file
  const seller = req.user

  if (!productId)
    throw { status: 400, msg: 'invalidProduct' }
  if (!productImageFile)
    throw { status: 400, msg: 'invalidImage' }

  return db.products.getProduct(productId)
    .then((product) => {
      if (!product)
        throw { status: 404, msg: 'invalidProduct' }
      if (product.selId !== seller.id)
        throw { status: 403, msg: 'foreignProduct' }

      const productImage = {
        url: productImageFile.filename,
        proId: productId
      }

      return db.images.insertImage(productImage)
        .then(result => res.send(result))
    })
    .catch(err => next(err))
})

router.delete('/:id', authMiddleware(), (req, res, next) => {
  const productId = req.params.id
  const seller = req.user

  if (!productId)
    throw { status: 400, msg: 'invalidProduct' }

  return db.products.getProduct(productId)
    .then((product) => {
      if (!product)
        throw { status: 404, msg: 'invalidProduct' }
      if (product.selId !== seller.id)
        throw { status: 403, msg: 'foreignProduct' }

      return db.products.deleteProduct(productId)
        .then(result => res.send(result))
    })
    .catch(err => next(err))
})

module.exports = router