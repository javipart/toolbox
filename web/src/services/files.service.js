import axios from "axios";

export const getFilesApi = async () => {
  const response = await axios('http://localhost:3001/files/data', {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    const { data } = response;
    console.log(data)
    return data;
  } else {
    throw new Error('Get gtransactions Error');
  }
};