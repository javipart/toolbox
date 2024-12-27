const express = require('express')
const fileRoutes = require('./routes/file.routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const startCronJobs = require('./utils/cron')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

// Iniciar trabajos cron
startCronJobs()

// Rutas
app.use('/files', fileRoutes)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
