const exportsObj = {}
const path = require('path')
const constants = require('../config/constants')

const generateFilename = (origFilename) => {
  const filename = getRandomStrings(10)
  const extension = path.extname(origFilename)
  return `${filename}${extension}`
}
exportsObj.generateFilename = generateFilename

exportsObj.saveFile = (file, dir) => {
  const filename = generateFilename(file.name)
  return new Promise((resolve, reject) => {
  	return file.mv(path.join(dir, filename), (err) => {
      if (err) return reject(err)
      return resolve({ filename })
	  })
  })
}

/* ---------------------------------------------- */

const multer  = require('multer')
const upload = multer({ dest: '/home/ec2-user/storage/laced/productImages' })
exportsObj.uploadMdw = upload

/* ---------------------------------------------- */

const getStoragePath = (key) => {
  const baseStoragePath = constants.appStoragePath
  return path.join(baseStoragePath, key)
}
exportsObj.getStoragePath = getStoragePath

const getStorageUrl = (key, filename) => {
  const storagePath = getStoragePath(key)
  return path.join(storagePath, filename)
}
exportsObj.getStorageUrl = getStorageUrl

const getStaticFilesPath = (key) => {
  const baseStaticFilesPath = constants.staticFilesPath
  return path.join(baseStaticFilesPath, key)
}
exportsObj.getStaticFilesPath = getStaticFilesPath

const getStaticFilesUrl = (key, filename) => {
  const staticFilesPath = getStaticFilesPath(key)
  return path.join(staticFilesPath, filename)
}
exportsObj.getStaticFilesUrl = getStaticFilesUrl

module.exports = exportsObj