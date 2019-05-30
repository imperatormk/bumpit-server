const exportsObj = {}
const db = require(__basedir + '/db/controllers')

const validateEvent = (eventObj) => {
  const allFilled = eventObj
    && eventObj.type 
    && eventObj.entryId
    && eventObj.ordId
  if (!allFilled) return false
  const validTypes = ['CHARGE', 'SHIPPING', 'DISPUTE', 'COMPLETION', 'REFUND']
  if (!validTypes.includes(eventObj.type)) return false
  return true
}

const moveToNextState = (eventType) => {
  const map = {
    'CHARGE': 'PROCESSING',
    'SHIPPING': 'SHIPPED',
    'DISPUTE': 'DISPUTED',
    'COMPLETION': 'COMPLETED',
    'REFUND': 'REFUNDED'
  }
  return map[eventType] || null
}

exportsObj.createEvent = (event) => {
  if (!validateEvent(event))
    return Promise.reject({ status: 400, msg: 'invalidEvent' })
  return db.events.insertEvent(event)
    .then(() => {
      const nextState = moveToNextState(event.type)
      const orderId = event.ordId
      return db.orders.updateOrder({ status: nextState, id: orderId })
    })
}

module.exports = exportsObj