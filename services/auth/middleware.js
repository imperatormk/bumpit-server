const passport = require('passport')

const middlewareFn = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) return res.status(401).send(err)
    if (!user) return res.status(401).send({ msg: 'notAuth' })
    req.user = user
    next()
  })(req, res, next)
}

module.exports = middlewareFn