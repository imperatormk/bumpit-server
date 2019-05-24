const jwtSecret = require('./config/jwtConfig')

const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUNDS = 12

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const extractJWT = require('passport-jwt').ExtractJwt

const db = require(__basedir + '/db/controllers')

passport.use('register', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
}, (username, password, next) => {
  return db.users.getUserAuth({ username })
    .then((user) => {
      if (user != null) return next(null, false, { status: 409, msg: 'usernameTaken' })
      return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
          return User.create({ username, password: hashedPassword })
            .then(user => next(null, user.toJSON()))
        })
    })
    .catch(err => next(err))
}))

passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
}, (username, password, next) => {
  return db.users.getUserAuth({ username })
    .then((user) => {
      if (!user) return next(null, false, { status: 401, msg: 'badUsername' })
      return bcrypt.compare(password, user.password)
        .then((response) => {
          if (!response) return next(null, false, { status: 401, msg: 'badPassword' })
          return next(null, user.toJSON())
        })
    })
    .catch(err => next(err))
}))

const opts = {
  jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret
}

passport.use('jwt', new JwtStrategy(opts, (jwtPayload, next) => {
  return db.users.getUserAuth({ username: jwtPayload.username })
    .then((user) => {
      if (user) { next(null, user) }
      else { next(null, false) }
    })
    .catch((err) => {
      next(err)
    })
}))

passport.serializeUser((user, next) => {
  next(null, user)
})

passport.deserializeUser((user, next) => {
  next(null, user)
})