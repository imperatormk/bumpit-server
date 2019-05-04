const braintree = require("braintree")

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'DVE2VFV9AQ5NW',
  publicKey: 'ASYdlfnfeDd6fIqa8nkH0rRwN5LxtWN9hnT6dgIsvK3FnLN9NpngOwymaH7XvCxBDfhhKRlXQQSsDKRh',
  privateKey: 'EIQ0pmpTVFOUvfYjK1MPQHP4HnPRGeREokfEtbPvY8cNLurHHKEel-kAGQ-665ppdDRPN1cHVx6NKkhP'
})

module.exports = gateway