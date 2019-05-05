const braintree = require("braintree")

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '93qqnqznq62y8tjw',
  publicKey: '72hzwnvrccxzdffz',
  privateKey: '779ca2ddfa2f592c56117b1e61183553'
})

module.exports = gateway