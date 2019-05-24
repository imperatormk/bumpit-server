const express = require('express')
const router = express.Router()
const db = require(__basedir + '/db/controllers')

router.get('/', function(req, res) {
  return db.items.getItems()
    .then(items => res.send(items))
    .catch(err => next(err))
})

router.get('/:id', function(req, res, next) {
  const id = req.params.id
  return db.items.getItem(id)
    .then((item) => {
      if (!item) return next({ status: 404, msg: 'notFound' })
      return res.send(item)
    })
    .catch(err => next(err))
})

module.exports = router