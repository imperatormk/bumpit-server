const exportsObj = {}

const Refund = require('../models').refund
const Charge = require('../models').charge

exportsObj.getRefundById = (refId) => {
  const options = {
		include: [{
			model: Charge,
			as: 'charge'
		}],
    where: { id: refId }
	}
  return Refund.findOne(options)
}

exportsObj.getRefund = (refund) => {
  const options = {
		include: [{
			model: Charge,
			as: 'charge'
		}],
    where: refund
	}
  return Refund.findOne(options)
}

exportsObj.insertRefund = (refund) => {
	return Refund.create(refund)
}

exportsObj.deleteRefund = (refId) => {
	return Refund.destroy({ where: { id: refId }})
	  .then(() => ({ id: refId }))
}

module.exports = exportsObj