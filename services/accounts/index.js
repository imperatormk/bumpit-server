const exportsObj = {}

const db = require(__basedir + '/db/controllers')
const customersService = require(__basedir + '/services/payments').customers
const helper = require('./helper')

const sanitizeUser = (user) => {
  const passwordFields = ['password', 'confirmPassword']
  const requiredFields = ['username', 'email', ...passwordFields]
  const badFields = []
  const sanitizedUser = {}

  if (!user) return null

  requiredFields.forEach((field) => {
    const value = user[field] && user[field].trim()
    sanitizedUser[field] = value
    if (!value) badFields.push(field)
  })

  const passwordsMatch = sanitizedUser.password === sanitizedUser.confirmPassword
  const isPasswordEmpty = !!badFields.filter(field => passwordFields.includes(field)).length
  if (!passwordsMatch && !isPasswordEmpty) badFields.push(...passwordFields)

  if (badFields.length) return { badFields }
  delete sanitizedUser.confirmPassword
  return { user: sanitizedUser }
}

const checkDuplicateValues = (user) => {
  const duplicateValues = ['username', 'email'].map((field) => {
    const criteria = {}
    criteria[field] = user[field]
    return db.users.getUser(criteria)
      .then(result => ({ exists: !!result, field }))
  })
  return Promise.all(duplicateValues)
    .then((results) => results
      .filter(result => result.exists)
      .map(result => result.field))
}

exportsObj.register = (user) => {
  const sanitizationResult = sanitizeUser(user)
  if (!sanitizationResult) 
    return Promise.reject({ status: 400, msg: 'emptyUser' })
  if (sanitizationResult.badFields) 
    return Promise.reject({ status: 400, msg: 'invalidFields', details: sanitizationResult.badFields })

  const sanitizedUser = sanitizationResult.user
  return checkDuplicateValues(sanitizedUser)
    .then((duplicateValues) => {
      if (duplicateValues.length)
        return Promise.reject({ status: 409, msg: 'duplicateFields', details: duplicateValues })
      return helper.hashPassword(sanitizedUser.password)
        .then(hashedPassword => ({ ...user, password: hashedPassword }))
        .then(user => customersService.createCustomerIfNotExists(user, 'email')
          .then(stripeCustomer => ({ ...user, stripeCustId: stripeCustomer.id }))
        )
        .then(user => db.users.insertUser(user))
        .then((user) => {
          const userId = user.id
          const userSetting = {
            disableTrades: false,
            language: 'EN',
            currency: 'USD',
            notifOnLike: false,
            notifOnFollow: false,
            notifOnFriendPost: false
          }
          return db.users.insertUserSettings(userId, userSetting)
            .then(() => user)
        })
    })
}

module.exports = exportsObj
