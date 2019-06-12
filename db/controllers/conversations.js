const exportsObj = {}

const Conversation = require('../models').conversation
const ChatMessage = require('../models').chatMessage
const User = require('../models').user

const getConversation = (conversation) => {
	const options = {
    include: [{
      model: User,
      attributes: ['id'],
      as: 'buyer'
    }, {
      model: ChatMessage,
      as: 'messages',
      order: [['id', 'DESC']],
      limit: 200
    }],
    where: {
      ...conversation
    }
  }
	return Conversation.findOne(options)
	  .then((conversation) => {
      if (!conversation) return null
      const messages = conversation.messages.map(message => message.toJSON())
      return {
        ...conversation.toJSON(),
        messages
      }
    })
}

exportsObj.createOrGetConversation = (conversation) => {
  const { usrId, ordId } = conversation
  if (!usrId || !ordId)
    return Promise.reject({ msg: 'invalidData' })

  return getConversation({ usrId, ordId })
    .then((existingConvo) => {
      if (!existingConvo)
        return Conversation.create(conversation)
          .then((newConvo) => getConversation({ id: newConvo.id }))
      return Promise.resolve(existingConvo)
    })
}

exportsObj.insertChatMessage = (chatMessage) => {
  const { cnvId, content } = chatMessage
  const contentTrimmed = content.trim()

  if (!cnvId | !contentTrimmed)
    return Promise.reject({ msg: 'invalidData' })

	return ChatMessage.create({
    ...chatMessage,
    content: contentTrimmed
  })
}

module.exports = exportsObj