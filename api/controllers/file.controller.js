import { fetchFilesData, fetchFiles } from '../services/file.service.js'

const getFileData = async (req, res) => {
  try {
    const { fileName } = req.query;
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

export { getFileData, getFileList }
