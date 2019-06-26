const router = require('express').Router()

const accountsRoutes = require('./accounts')
const authRoutes = require('./auth')
const brandsRoutes = require('./brands')
const categoriesRoutes = require('./categories')
const conversationsRoutes = require('./conversations')
const likeRoutes = require('./likes')
const ordersRoutes = require('./orders')
const productsRoutes = require('./products')
const userRoutes = require('./user')

const checkEmptyBody = (req, res, next) => {
	const body = req.body
	if (!body || Object.keys(body).length === 0) {
    return next({ status: 400, msg: 'emptyBody' })
  }
	next()
}

const convertToNumbers = (req, res, next) => {
  const params = req.params
  Object.keys(params).forEach((paramKey) => {
  	if (!isNan(params[paramKey])) {
      req.params[paramKey] = Number(params[paramKey])
    }
  })
  next()
}
router.use(convertToNumbers) // doesn't work atm

router.use('/accounts', accountsRoutes)
router.use('/auth', authRoutes)
router.use('/brands', brandsRoutes)
router.use('/categories', categoriesRoutes)
router.use('/conversations', conversationsRoutes)
router.use('/likes', likeRoutes)
router.use('/orders', ordersRoutes)
router.use('/products', productsRoutes)
router.use('/user', userRoutes)

module.exports = router