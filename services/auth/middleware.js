const passport = require('passport')

const middlewareFn = (config = {}) => {
  const { optional } = config

  const middlewareCore = (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      if (err) return next(err)
      if (!user && !optional) return next({ status: 401, msg: 'notAuth' })

      req.user = user
      next()
    })(req, res, next)
  }

  return middlewareCore
}

module.exports = middlewareFn