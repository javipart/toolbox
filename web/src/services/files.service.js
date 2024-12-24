import axios from "axios";

export const getFilesApi = async (fileName) => {
  const baseURL = 'http://localhost:3001/files/data';
  const url = fileName && fileName.trim() !== ''
    ? `${baseURL}?fileName=${encodeURIComponent(fileName)}`
    : baseURL;

  const response = await axios(url, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    const { data } = response;
    return data;
  } else {
    throw new Error('Get gtransactions Error');
  }
};

export const getFilesListApi = async (fileName) => {
  const url = 'http://localhost:3001/files/list';
  const response = await axios(url, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    const { data } = response;
    return data;
  } else {
    throw new Error('Get gtransactions Error');
  }
};
