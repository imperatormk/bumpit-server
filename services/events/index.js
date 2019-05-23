const exportsObj = {}
const db = require(__basedir + '/db/controllers')

const validateEvent = (eventObj) => {
  const allFilled = eventObj && eventObj.type && eventObj.entryId && eventObj.ordId
  if (!allFilled) return false
  const validTypes = ['CHARGE', 'SHIPPING', 'DISPUTE', 'COMPLETION', 'REFUND', 'REVIEW']
  if (!validTypes.includes(eventObj.type)) return false
  return true
}

const moveToNextState = (eventType) => {
  const map = {
    'CHARGE': 'PROCESSING',
    'SHIPPING': 'IN_TRANSIT',
    'DISPUTE': 'DISPUTED',
    'COMPLETION': 'COMPLETED',
    'REFUND': 'REFUNDED',
    'REVIEW': 'REVIEWED'
  }
  return map[eventType] || null
}

const createEvent = (event) => {
  if (!validateEvent(event)) return Promise.reject({ msg: 'invalidEvent' })
  return db.events.insertEvent(event)
    .then(() => {
      const nextState = moveToNextState(event.type)
      const orderId = event.ordId
      return db.orders.modifyOrder({ status: nextState, id: orderId })
    })
}

exportsObj.createEvent = createEvent

module.exports = exportsObj