const cron = require('node-cron')
const { revalidateFiles } = require('../services/file.service')

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

module.exports = filesValidationCron
