const router = require('express').Router()

const apiRoutes = require('./api')

let startDate = new Date()

router.get('/', (req, res) => {
  return res.json({
    sane: true,
	  startDate
  })
})

router.use('/api', apiRoutes)

router.use((err, req, res, next) => {
  if (!err) return next()
  // TODO: add logger
  return res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' })
})

module.exports = router