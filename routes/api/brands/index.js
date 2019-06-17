const router = require('express').Router()

const db = require(__basedir + '/db/controllers')

router.get('/', (req, res, next) => {
  return db.brands.getBrands()
    .then((brands) => {
      return res.send(brands)
    })
    .catch(err => next(err))
})

module.exports = router