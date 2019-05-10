const express = require('express')
const router = express.Router()
const stripe = require(__basedir + '/services/stripe')

router.post('/charge', function(req, res) {
    var stripeToken = req.body.token

    const chargeObj = { // temp data
      amount: 50,
      currency: 'USD',
      card: stripeToken,
      description: 'thou shall be a desc'
    }

    return stripe.charges.create(chargeObj)
      .then(stripeRes => res.send(stripeRes))
      .catch(err => res.status(err.statusCode).send(err))
})

module.exports = router