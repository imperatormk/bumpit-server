const exportsObj = {}

const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUNDS = 12

const db = require(__basedir + '/db/controllers')

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

const checkExistingValues = (user) => {
  const existingValues = ['username', 'email'].map((field) => {
    const criteria = {}
    criteria[field] = user[field]
    return db.users.getUser(criteria)
      .then(result => ({ exists: !!result, field }))
  })
  return Promise.all(existingValues)
    .then(results => results
      .filter(result => result.exists)
      .map(result => result.field))
}

exportsObj.register = (user) => {
  const sanitizationResult = sanitizeUser(user)
  if (!sanitizationResult) return Promise.reject({ status: 400, msg: 'emptyUser' })
  if (sanitizationResult.badFields) return Promise.reject({ status: 400, msg: 'invalidFields', details: sanitizedUser.badFields })

  const sanitizedUser = sanitizationResult.user
  return checkExistingValues(sanitizedUser)
    .then((existingValues) => {
      if (existingValues.length) return Promise.reject({ status: 409, msg: 'existingFields', details: existingValues })
      return bcrypt.hash(sanitizedUser.password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => db.users.insertUser({ ...sanitizedUser, password: hashedPassword }))
        .then(user => user.toJSON())
    })
}

module.exports = exportsObj