const router = require('express').Router()

const db = require(__basedir + '/db/controllers')

router.get('/', (req, res, next) => {
  return db.categories.getCategories()
    .then((categories) => {
      return res.send(categories)
    })
    .catch(err => next(err))
})

module.exports = router