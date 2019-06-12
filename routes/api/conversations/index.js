const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware

router.post('/', authMiddleware, (req, res, next) => { // TODO: check if convo with self!
  const usrId = req.user.id
  const { ordId } = req.body
  
  return db.conversations.createOrGetConversation({ ordId, usrId })
    .then(conversation => res.send(conversation))
    .catch(err => next(err))
})

router.post('/:id', authMiddleware, (req, res, next) => {
  const cnvId = req.params.id
  const chatMessage = req.body

  if (chatMessage.fromBuyer == null) chatMessage.fromBuyer = false // TODO: temp, we can check if buyer here
  
  return db.conversations.insertChatMessage({
    ...chatMessage,
    cnvId
  })
    .then(msg => res.send(msg))
    .catch(err => next(err))
})

module.exports = router