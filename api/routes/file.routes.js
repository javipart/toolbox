import express from 'express'
import { getFileData, getFileList } from '../controllers/file.controller.js'

const router = express.Router()

router.get('/data', getFileData)

router.get('/list', getFileList)

export default router
