import express from 'express';
import { getFileData } from '../controllers/file.controller.js';

const router = express.Router();

router.get('/data', getFileData);

export default router;
