import axios from 'axios'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import pLimit from 'p-limit'
import { BASE_URL, LIMIT, TEMP_DIR, API_KEY } from '../utils/constants.js'
import { getCachedData, setCachedData } from '../utils/cache.js'
import crypto from 'crypto'

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR)
}

const hashCacheFilePath = path.join(TEMP_DIR, 'fileHashes.json')

const getHashCache = () => {
  if (fs.existsSync(hashCacheFilePath)) {
    return JSON.parse(fs.readFileSync(hashCacheFilePath, 'utf8'))
  }
  return {}
}

const saveHashCache = (hashes) => {
  fs.writeFileSync(hashCacheFilePath, JSON.stringify(hashes, null, 2), 'utf8')
}

const calculateFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath)
  return crypto.createHash('md5').update(fileBuffer).digest('hex')
}

const hasFileChanged = (fileName, filePath, hashCache) => {
  const currentHash = calculateFileHash(filePath)
  return hashCache[fileName] !== currentHash
}

const doesFileExist = (fileName) => {
  const filePath = path.join(TEMP_DIR, fileName)
  return fs.existsSync(filePath)
}

const downloadFile = async (fileName, tempFilePath = null) => {
  const filePath = path.join(TEMP_DIR, fileName)

  if (doesFileExist(fileName) && !tempFilePath) {
    console.log(`File ${fileName} exists`)
    return filePath
  }

  const writer = fs.createWriteStream(tempFilePath || filePath)

  try {
    const response = await axios.get(`${BASE_URL}/file/${fileName}`, {
      headers: { Authorization: API_KEY },
      responseType: 'stream'
    })
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(tempFilePath || filePath))
      writer.on('error', reject)
    })
  } catch (error) {
    throw new Error(`Error downloading file ${fileName}: ${error.message}`)
  }
}

const lineValidation = (text, number, hex) => {
  const isText = typeof text === 'string' && text.trim().length > 0
  const isNumber = !isNaN(Number(number))
  const isHex = /^[a-f0-9]{32}$/i.test(hex)
  return isText && isNumber && isHex
}

const processFile = async (filePath) => {
  const results = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (lineValidation(row.text, row.number, row.hex)) {
          results.push({
            text: row.text,
            number: row.number,
            hex: row.hex
          })
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

const fetchFiles = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: API_KEY }
    })
    const files = data.files || []
    return files
  } catch (error) {
    throw new Error(`Error fetching files: ${error.message}`)
  }
}

const fetchFilesData = async (filter = null) => {
  try {
    const cachedData = await getCachedData('processedFiles')
    console.log(cachedData)
    if (cachedData?.length) {
      if (filter) {
        return cachedData.filter(fileData => fileData.file === `${filter}.csv`)
      }
      return cachedData
    }

    const hashCache = getHashCache()
    const limit = pLimit(LIMIT)
    const files = await fetchFiles()

    const filePromises = files.map((fileName) =>
      limit(async () => {
        try {
          const filePath = await downloadFile(fileName)

          const lines = await processFile(filePath)

          if (lines.length) {
            hashCache[fileName] = calculateFileHash(filePath)
            return { file: fileName, lines }
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}: ${error.message}`)
        }
      })
    )

    const results = await Promise.allSettled(filePromises)

    const fileData = results
      .filter((result) => result.status === 'fulfilled' && result.value)
      .map(result => result.value)

    saveHashCache(hashCache)

    setCachedData('processedFiles', fileData)

    if (filter) {
      return fileData.filter(file => file.file === `${filter}.csv`)
    }
    return fileData
  } catch (error) {
    throw new Error(`Error fetching files: ${error.message}`)
  }
}

const revalidateFiles = async () => {
  try {
    const hashCache = getHashCache()
    const files = await fetchFiles()
    const limit = pLimit(LIMIT)

    const filePromises = files.map((fileName) =>
      limit(async () => {
        const filePath = path.join(TEMP_DIR, fileName)
        const tempFilePath = `${filePath}.tmp`

        await downloadFile(fileName, tempFilePath)
        const newHash = calculateFileHash(tempFilePath)

        if (hashCache[fileName] === newHash) {
          console.log(`File ${fileName} not changed. Skiping.`)
          fs.unlinkSync(tempFilePath)
          return
        }

        console.log(`File ${fileName} changed. Replace.`)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
        fs.renameSync(tempFilePath, filePath)
        hashCache[fileName] = newHash
      })
    )

    await Promise.allSettled(filePromises)

    saveHashCache(hashCache)
    console.log('Revalidation success.')
  } catch (error) {
    console.error('Error revalidation:', error.message)
  }
}

export { fetchFilesData, fetchFiles, revalidateFiles }
