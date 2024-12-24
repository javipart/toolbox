import { fetchFilesData } from '../services/file.service.js'; 

const getFileData = async (req, res) => {
  try {
    const data = await fetchFilesData();
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getFileData };
