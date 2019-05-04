const express = require('express')
const router = express.Router()
const braintree = require(__basedir + '/services/braintree')

router.get('/token', (req, res) => {
  braintree.clientToken.generate({}, function (err, response) {
    if (err) return res.status(500).send({ error: err })

    const clientToken = response.clientToken
    res.json({ token: clientToken })
  })
})

module.exports = router