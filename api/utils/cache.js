const NodeCache = require('node-cache')

const dataCache = new NodeCache({ stdTTL: 3600 })

const getCachedData = (key) => dataCache.get(key)

const setCachedData = (key, value) => dataCache.set(key, value)

module.exports = { getCachedData, setCachedData }
