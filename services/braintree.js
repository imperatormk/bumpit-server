const braintree = require("braintree")

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC,
  privateKey: process.env.BT_PRIVATE
})

module.exports = gateway