const express = require('express')
const router = express.Router()
const db = require(__basedir + '/db/controllers')

router.get('/', function(req, res) {
  return db.items.getItems()
    .then(items => res.send(items))
    .catch(err => res.status(500).send(err))
})

router.get('/:id', function(req, res) {
  const id = req.params.id
  return db.items.getItem(id)
    .then((item) => {
      if (!item) return res.status(404).send({ msg: 'notFound' })
      return res.send(item)
    })
    .catch(err => res.status(500).send(err))
})

module.exports = router