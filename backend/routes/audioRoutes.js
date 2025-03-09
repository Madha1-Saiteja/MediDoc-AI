const express = require('express');
const { upload, uploadAudio } = require('../controllers/audioController');
const router = express.Router();

router.post('/upload', upload.single('file'), uploadAudio);

module.exports = router;