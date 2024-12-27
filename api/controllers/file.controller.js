const { fetchFilesData, fetchFiles } = require('../services/file.service')

const getFileData = async (req, res) => {
  try {
    const { fileName } = req.query
    const data = await fetchFilesData(fileName)
    res.status(200).json(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const getFileList = async (req, res) => {
  try {
    const data = await fetchFiles()
    res.status(200).json(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { getFileData, getFileList }
