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

// next time you'll probably be able to use promises :)
const wrappedFunctions = [
  { title: 'getCustomersByCriteria', name: 'list', params: ['criteria'] },
  { title: 'getCustomerById', name: 'retrieve', params: ['custId'] }
]
wrappedFunctions.forEach((fn) => {
  exportsObj[fn.title] = (...args) => {
    return new Promise((resolve, reject) => {
      stripe.customers[fn.name](
        ...args,
        (err, result) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  }
})

exportsObj.createCustomerIfNotExists = (user, uniqueKey) => {
  const criteria = {}
  criteria[uniqueKey] = user[uniqueKey]
  criteria.limit = 1

  return exportsObj.getCustomersByCriteria(criteria)
    .then(resp => resp.data)
    .then(customers => customers[0] || null)
    .then(customer => customer || createCustomer(user))
}

module.exports = exportsObj