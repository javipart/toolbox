// services/fileService.js
import axios from 'axios';
import csv from 'csv-parser';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit';
import { BASE_URL, LIMIT, TEMP_DIR, API_KEY } from '../utils/constants.js'

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const doesFileExist = (fileName) => {
  const filePath = path.join(TEMP_DIR, fileName);
  return fs.existsSync(filePath);
};

const downloadFile = async (fileName) => {
  const filePath = path.join(TEMP_DIR, fileName);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios.get(`${BASE_URL}/file/${fileName}`, {
      headers: { Authorization: API_KEY },
      responseType: 'stream',
    });
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Error downloading file ${fileName}: ${error.message}`);
  }
};

const lineValidation = (text, number, hex) => {
  const isText = typeof text === 'string' && text.trim().length > 0;
  const isNumber = !isNaN(Number(number));
  const isHex = /^[a-f0-9]{32}$/i.test(hex);
  return isText && isNumber && isHex;
}

const processFile = async (filePath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (lineValidation(row.text, row.number, row.hex)) {
          results.push({
            text: row.text,
            number: row.number,
            hex: row.hex,
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

const fetchFilesData = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/files`, {
      headers: { Authorization: API_KEY },
    });
    const files = data.files || [];
    const limit = pLimit(LIMIT);

    const filePromises = files.map((fileName) =>
      limit(async () => {
        try {
          const filePath = await downloadFile(fileName);
          const lines = await processFile(filePath);
          fs.unlinkSync(filePath);
          if (lines.length) {
            return { file: fileName, lines };
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}: ${error.message}`);
        }
      })
    );

    const results = await Promise.allSettled(filePromises);

    const fileData = results
      .filter((result) => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
    return fileData;
  } catch (error) {
    throw new Error(`Error fetching files: ${error.message}`);
  }
};

export { fetchFilesData };
