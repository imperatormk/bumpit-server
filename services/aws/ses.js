const AWS = require('./provider')
const striptags = require('striptags')

const exportsObj = {}

exportsObj.sendEmail = (msgObj) => {
  const charset = 'UTF-8'

  const params = {
    Destination: {
      ToAddresses: msgObj.to
    },
    Message: {
      Body: {
        Html: {
          Charset: charset,
          Data: msgObj.body
        },
        Text: {
          Charset: charset,
          Data: striptags(msgObj.body)
        }
      },
      Subject: {
        Charset: charset,
        Data: msgObj.subject
      }
  },
    Source: msgObj.from,
    ReplyToAddresses: [msgObj.from]
  }

  return new AWS.SES()
    .sendEmail(params)
    .promise()
}

module.exports = exportsObj