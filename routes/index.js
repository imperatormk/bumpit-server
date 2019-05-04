const apiRoutes = require('./api')
const express = require('express')
const router = express.Router()

let startDate = new Date()

router.get('/', (req, res) => {
  res.json({
    sane: 'true',
	startDate
  })
})

router.use('/api', apiRoutes)

module.exports = router