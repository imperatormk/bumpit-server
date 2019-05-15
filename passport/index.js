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
}, (username, password, done) => {
  return db.users.getUserAuth({ username })
    .then((user) => {
      if (user != null) return done(null, false, { msg: 'usernameTaken' })
      return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
          return User.create({ username, password: hashedPassword })
            .then(user => done(null, user.toJSON()))
        })
    })
    .catch(err => done(err))
}))

passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
}, (username, password, done) => {
  return db.users.getUserAuth({ username })
    .then((user) => {
      if (!user) return done(null, false, { msg: 'badUsername' })
      return bcrypt.compare(password, user.password)
        .then((response) => {
          if (!response) return done(null, false, { msg: 'badPassword' })
          return done(null, user.toJSON())
        })
    })
    .catch(err => done(err))
}))

const opts = {
  jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret
}

passport.use('jwt', new JwtStrategy(opts, (jwtPayload, done) => {
  return db.users.getUserAuth({ username: jwtPayload.username })
    .then((user) => {
      if (user) { done(null, user) }
      else { done(null, false) }
    })
    .catch(err => done(err))
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})