const router = require('express').Router()

const uploadMwd = require(__basedir + '/helpers').uploadMwd
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

  return db.products.insertProduct(product)
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.post('/:id/images', uploadMwd.single('productImage'), (req, res, next) => {
  const productId = req.params.id
  console.log(productId, req.file)
})

router.post('/:id/images/temp', (req, res, next) => {
  const productId = req.params.id
  const imageFile = req.files && req.files[0]
  
  if (!imageFile)
    return next({ status: 400, msg: 'noFile' })
  
  const productImagesPath = helpers.getStoragePath('productImages')

  const file = imageFiles[fileKey]
  const storagePromise = helpers.saveFile(file, productImagesPath)
  
  const getImageData = (storageObj) => {
    return {
      url: storageObj.filename,
      featured: false,
      proId: productId
    }
  }

  return storagePromise
    .then(storageObj => getImageData({ ...storageObj }))
    .then(productImage => db.images.insertImage(productImage))
    .then(result => res.send(result))
    .catch(err => next(err))
})

module.exports = router