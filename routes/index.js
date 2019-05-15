const express = require('express')
const router = express.Router()

const apiRoutes = require('./api')

let startDate = new Date()

router.get('/', (req, res) => {
  return res.json({
    sane: true,
	  startDate
  })
})

router.use('/api', apiRoutes)

module.exports = router