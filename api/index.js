import express from 'express'
import fileRoutes from './routes/file.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import startCronJobs from './utils/cron.js'

const app = express()
const PORT = 3001
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

startCronJobs()

app.use('/files', fileRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
