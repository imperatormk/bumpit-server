const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware

router.post('/', authMiddleware, (req, res, next) => { // TODO: check if convo with self!
  const usrId = req.user.id
  const { proId } = req.body
  
  return db.conversations.createOrGetConversation({ proId, usrId })
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
    .then((msg) => {
      req.app.io.sockets.in(`conv${cnvId}`).emit('msgReceived', msg)
      res.send(msg)
    })
    .catch(err => next(err))
})

module.exports = router