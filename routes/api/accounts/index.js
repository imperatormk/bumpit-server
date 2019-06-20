const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const registerService = require(__basedir + '/services/accounts').register
const authMiddleware = require(__basedir + '/services/auth').middleware
const uploadMiddleware = require(__basedir + '/helpers').uploadMiddleware

router.post('/register', (req, res, next) => {
  const user = req.body
  return registerService(user)
    .then(user => res.send(user))
    .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
  const userId = req.params.id

  return db.users.getUserById(userId) // DRY!
    .then((user) => {
      if (!user) throw { status: 404, msg: 'userNotFound' }
      return res.send(user)
    })
    .catch(err => next(err))
})

router.post('/me/avatar', authMiddleware, uploadMiddleware('avatars').single('avatar'), (req, res, next) => {
  const userId = req.user.id
  const avatar = req.file.filename

  return db.users.updateAvatar(userId, avatar)
    .then((avatar) => res.json({ avatar }))
    .catch(err => next(err))
})

router.post('/:id/connections', (req, res, next) => {
  const userId = req.params.id
  const config = req.body || {}
  const types = config.types || []
  const count = config.count === true
  
  return db.users.getUserById(userId) // DRY!
    .then((user) => {
      if (!user) throw { status: 404, msg: 'userNotFound' }
      return user
    })
    .then((user) => db.connections.getConnectionsForUser(user.id, types))
    .then((connections) => {
      if (!count) return res.send(connections)
      let followerCount = 0
      let followeeCount = 0

      connections.forEach((connection) => {
        if (connection.type === 'follower') followerCount += 1
        if (connection.type === 'followee') followeeCount += 1
      })

      const conCounts = {
        followers: followerCount,
        followees: followeeCount
      }
      return res.send(conCounts)
    })
    .catch(err => next(err))
})

router.put('/:id/social', authMiddleware, (req, res, next) => {
  const userId = req.params.id
  const action = req.body.action || ''

  const validActions = ['follow', 'unfollow'] // maybe add block here?
  const validAction = validActions.includes(action)
  const isMe = req.user.id === userId // TODO: middleware for this

  if (!(userId && validAction && !isMe)) return next({ status: 400, msg: 'invalidData' })

  return db.users.getUserById(userId) // DRY!
    .then((user) => {
      if (!user) throw { status: 404, msg: 'userNotFound' }
      return user
    })
    .then((user) => {
      const connection = {
        usrFromId: req.user.id,
        usrToId: user.id
      }
      return db.connections.getConnection(connection)
        .then((connResult) => {
          const connObj = {
            exists: !!connResult,
            connection:
              connResult ?
              connResult.toJSON() :
              connection 
          }
          return connObj
        })
    })
    .then((result) => {
      const exists = result.exists
      const connection = result.connection
      let actionFn = null
      if (exists && action === 'unfollow')
        actionFn = db.connections.deleteConnection(connection.id)
      if (!exists && action === 'follow')
        actionFn = db.connections.insertConnection(connection)

      if (actionFn)
        return actionFn
          .then(() => res.send({ status: 'success' }))
      throw { status: 400, msg: 'impossibleAction' }
    })
    .catch(err => next(err))
})

module.exports = router