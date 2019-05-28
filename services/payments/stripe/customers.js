const exportsObj = {}
const stripe = require('./provider')

const createCustomer = (user) => {
  const customer = {
    email: user.email,
    name: user.name,
    phone: user.phone,
    description: `Initial email address: ${user.email}`
  }
  return stripe.customers.create(customer)
    .then(customer => ({ id: customer.id }))
}

exportsObj.getCustomersByCriteria = (criteria) => {
  return stripe.customers.list(criteria)
}

exportsObj.getCustomerById = (custId) => {
  return stripe.customers.retrieve(custId)
}

exportsObj.updateCustomer = (custId, values) => {
  return stripe.customers.update(custId, values)
}

exportsObj.createCustomerIfNotExists = (user, uniqueKey) => {
  const criteria = {}
  criteria[uniqueKey] = user[uniqueKey]
  criteria.limit = 1

  return exportsObj.getCustomersByCriteria(criteria)
    .then(resp => resp.data)
    .then(customers => customers[0] || null)
    .then(customer => customer || createCustomer(user))
}

exportsObj.getCustomerBalance = (custId) => {
  return exportsObj.getCustomerById(custId)
    .then(customer => customer.account_balance)
}

exportsObj.updateCustomerBalanceBy = (amount, custId) => {
  return exportsObj.getCustomerById(custId)
    .then((customer) => {
      const currentBalance = customer.account_balance
      const newBalance = currentBalance + amount
      return newBalance
    })
    .then((newBalance) => {
      return exportsObj.updateCustomer(custId, { account_balance: newBalance })
        .then((customer) => {
          const currentBalance = customer.account_balance
          const status = currentBalance === newBalance ? 'success' : 'error'
          return { status }
        })
    })
}

module.exports = exportsObj