const jwt = require('jsonwebtoken')
const passport = require('passport')

const jwtSecret = require(__basedir + '/passport/config/jwtConfig')
const db = require(__basedir + '/db/controllers')

const loginFn = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return res.status(500).send(err)
    if (info) return res.status(400).send(info)
    return req.logIn(user, (err) => {
      if (err) return res.status(401).send(err)
      return db.users.getUserAuth({ username: user.username })
        .then((user) => {
          const token = jwt.sign({ username: user.username }, jwtSecret.secret)
          return res.send({ token })
        })
    })
  })(req, res, next)
}

module.exports = loginFn