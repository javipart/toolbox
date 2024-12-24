import cron from 'node-cron'
import { revalidateFiles } from '../services/file.service.js'

const filesValidationCron = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Cron revalidateFiles...')
    try {
      await revalidateFiles()
      console.log('Cron revalidateFiles success.')
    } catch (error) {
      console.error('Error:', error.message)
    }
  })
}

export default filesValidationCron
