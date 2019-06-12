const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const authMiddleware = require(__basedir + '/services/auth').middleware

router.get('/:id', authMiddleware, (req, res, next) => {
  const cnvId = req.params.id
  const usrId = req.user.id

  return db.conversations.getConversation({ id: cnvId })
    .then((conversation) => {
      if (!conversation) throw { status: 404, msg: 'convoNotFound' }

      const productId = conversation.proId
      return db.products.getProduct(productId)
        .then((product) => {
          const sellerId = product.sellerId
          const amISeller = usrId === sellerId
          const amIBuyer = usrId === conversation.usrId

          if (!amISeller && !amIBuyer) throw { status: 400, msg: 'userDoesNotBelongToConv' }
          
          const messages = conversation.messages.map((message) => {
            return {
              ...message,
              fromMe: (message.fromBuyer && amIBuyer) || (!message.fromBuyer && amISeller)
            }
          })

          return res.send({
            ...conversation,
            messages
          })
        })
    })
    .catch(err => next(err))
})

router.post('/', authMiddleware, (req, res, next) => { // for buyers only
  const usrId = req.user.id
  const { proId } = req.body

  return db.products.getProduct(proId)
    .then((product) => {
      const sellerId = product.selId
      if (usrId === sellerId) throw { status: 409, msg: 'cantWithMyself' }
      return db.conversations.createOrGetConversation({ proId, usrId })
        .then((conversation) => {
          if (!conversation) throw { status: 404, msg: 'convoNotFound' }

          const messages = conversation.messages.map((message) => {
            return {
              ...message,
              fromMe: message.fromBuyer
            }
          })

          return res.send({
            ...conversation,
            messages
          })
        })
    })
    .catch(err => next(err))
})

router.post('/:id', authMiddleware, (req, res, next) => {
  const usrId = req.user.id
  const cnvId = req.params.id
  const chatMessage = req.body

  return db.conversations.getConversation({ id: cnvId })
    .then((conversation) => {
      if (!conversation) throw { status: 404, msg: 'convoNotFound' }

      const productId = conversation.proId
      return db.products.getProduct(productId)
        .then((product) => {
          const sellerId = product.selId
          if (usrId === sellerId) {
            chatMessage.fromBuyer = false
          } else if (usrId === conversation.usrId) {
            chatMessage.fromBuyer = true
          } else {
            throw { status: 400, msg: 'userDoesNotBelongToConv' }
          }
          chatMessage.cnvId = cnvId

          return db.conversations.insertChatMessage(chatMessage)
            .then((msg) => {
              req.app.io.sockets.in(`conv${cnvId}`).broadcast.emit('msgReceived', { ...msg, fromMe: false })
              res.send({ ...msg, fromMe: true })
            })
        })
    })
    .catch(err => next(err))
})

module.exports = router