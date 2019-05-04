const express = require('express')
const router = express.Router()

let startDate = new Date()

router.get('/', (req, res) => {
  res.json({
    sane: 'true',
	startDate
  })
})

module.exports = router