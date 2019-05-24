const router = require('express').Router()

const ordersRoutes = require('./orders')
const productsRoutes = require('./products')
const authRoutes = require('./auth')
const accountsRoutes = require('./accounts')

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

router.use('/orders', ordersRoutes)
router.use('/products', productsRoutes)
router.use('/auth', authRoutes)
router.use('/accounts', accountsRoutes)

module.exports = router