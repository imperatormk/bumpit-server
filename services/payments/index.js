const providerName = 'stripe'
const provider = require('./' + providerName)

const platformCharges = require(__basedir + '/services/platform/charges')

const exportsObj = {}

exportsObj.calculateCharges = (initial, extras) => {
  const proms = [
    platformCharges.getFees(true)
  ]
  if (extras && extras.length) {
    proms.push(platformCharges.getExtras())
  }
  return Promise.all(proms)
    .then(([fees, allExtras]) => {
      const initialCharge = { name: 'initial', flat: { ...initial }, type: 'base' }
      const charges = [initialCharge]
      fees.forEach((fee) => {
        delete fee.enabled
        fee.type = 'fee'
        charges.push(fee)
      })
      if (allExtras && allExtras.length) {
        const selExtras = allExtras
          .filter((extraObj) => extras.includes(extraObj.name))
        charges.push(...selExtras)
      }
      return charges
    })
}

module.exports = {
  ...provider,
  ...exportsObj
}