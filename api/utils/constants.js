const dotenv = require('dotenv')

// Configura las variables de entorno
dotenv.config()

const API_KEY = process.env.API_KEY || ''
const BASE_URL = process.env.EXTERNAL_API || ''
const TEMP_DIR = './tmp'
const LIMIT = 5

module.exports = { API_KEY, BASE_URL, TEMP_DIR, LIMIT }
