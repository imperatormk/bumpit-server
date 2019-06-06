const exportsObj = {}

exportsObj.getFees = (enabledOnly) => {
  const fees = []

  const processingFee = {
    name: 'processingFee',
    flat: {
      amount: 30,
      currency: 'USD' // needed?
    },
    percentage: 2.9,
    enabled: true
  }
  fees.push(processingFee)

  const profitFee = {
    name: 'profitFee',
    percentage: 1,
    enabled: false
  }
  fees.push(profitFee)

  return Promise.resolve(!enabledOnly
    ? fees
    : fees.filter(fee => fee.enabled))
}

exportsObj.getExtras = () => {
  const extras = []

  const authenticationService = {
    name: 'authenticationService',
    flat: {
      amount: 10,
      currency: 'USD' // needed?
    },
    percentage: 8
  }
  extras.push(authenticationService)

  return Promise.resolve(extras)
}

module.exports = exportsObj