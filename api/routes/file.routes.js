const express = require('express')
const { getFileData, getFileList } = require('../controllers/file.controller')

const router = express.Router()

router.get('/data', getFileData)
router.get('/list', getFileList)

module.exports = router
