const express = require('express')
const router = express.Router()
const paymentsRoutes = require('./payments')
const ordersRoutes = require('./orders')
const itemsRoutes = require('./items')
const authRoutes = require('./auth')

const checkEmptyBody = (req, res, next) => {
	const body = req.body
	if (!body || Object.keys(body).length === 0) {
    return res.status(400).send({ 'status': 'emptyBody' })
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

router.use('/payments', paymentsRoutes)
router.use('/orders', ordersRoutes)
router.use('/items', itemsRoutes)
router.use('/auth', authRoutes)

module.exports = router