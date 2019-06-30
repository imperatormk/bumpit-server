const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const registerService = require(__basedir + '/services/accounts').register
const authMiddleware = require(__basedir + '/services/auth').middleware

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

const groupBy = (arr, property) => {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) memo[x[property]] = []
    memo[x[property]].push(x)
    return memo
  }, {})
}

// get follower and followee count/objects for user
router.post('/:id/connections', authMiddleware({ optional: true }), (req, res, next) => {
  const myUserId = req.user ? req.user.id : -1
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
      return connections.map((connection) => {
        const conUserId = connection.userId

        // TODO: this probably deserves getUsers instead
        return db.users.getUserById(conUserId)
          .then((user) => {
            const userDto = {
              id: user.id,
              avatar: user.avatar,
              username: user.username,
              name: user.name,
              surname: user.surname
            }
            return userDto
          })
          .then((userDto) => {
            const connectionDto = {
              type: connection.type,
              user: userDto
            }
            return connectionDto
          })
      })
    })
    .then(connections => Promise.all(connections))
    .then((connections) => {
      const groupedConnections = groupBy(connections, 'type')
      // rename
      const followMap = {
        followees: groupedConnections.followee || [],
        followers: groupedConnections.follower || []
      }

      const followeeUserIds = followMap.followees.map(connection => connection.user.id)
      const followerUserIds = followMap.followers.map(connection => connection.user.id)

      const followeePromise = db.connections.isFollowingMe(myUserId, followeeUserIds)
        .then((results) => {
          return followMap.followees.map((followee) => {
            const followsMe = results.includes(followee.user.id)
            return {
              ...followee,
              followsMe
            }
          })
        })

      const followerPromise = db.connections.followedByMe(myUserId, followerUserIds)
        .then((results) => {
          return followMap.followers.map((follower) => {
            const followedByMe = results.includes(follower.user.id)
            return {
              ...follower,
              followedByMe
            }
          })
        })

      return Promise.all([followeePromise, followerPromise])
        .then(([ followeeResult, followerResult ]) => {
          return [ ...followeeResult, ...followerResult ]
        })
    })
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

// commit actions: follow, unfollow (and block?)
router.put('/:id/social', authMiddleware(), (req, res, next) => {
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
