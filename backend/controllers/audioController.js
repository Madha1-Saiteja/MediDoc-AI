const AudioFile = require('../models/audioFile');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const PDFDocument = require('pdfkit');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
});

// Placeholder function for speech-to-text conversion
const convertAudioToText = async (filePath) => {
  // Implement your speech-to-text conversion logic here
  // For example, using Google Cloud Speech-to-Text API
  return "Extracted text from audio";
};

// Function to rephrase text using MedGemini API
const rephraseText = async (text) => {
  const response = await axios.post('http://127.0.0.1:5000/chat', { message: text });
  return response.data.response;
};

// Function to generate PDF from text
const generatePDF = (text, outputPath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));
  doc.text(text);
  doc.end();
};

const uploadAudio = async (req, res) => {
  try {
    const audioFile = new AudioFile({ filePath: req.file.path });
    await audioFile.save();

    // Convert audio to text
    const extractedText = await convertAudioToText(req.file.path);
    console.log('Extracted text:', extractedText);

    // Rephrase text using MedGemini API
    const rephrasedText = await rephraseText(extractedText);
    console.log('Rephrased text:', rephrasedText);

    // Generate PDF from rephrased text
    const pdfPath = `uploads/${Date.now()}-transcription.pdf`;
    generatePDF(rephrasedText, pdfPath);
    console.log('PDF generated at:', pdfPath);

    res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path, pdfPath });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
};

module.exports = {
  upload,
  uploadAudio,
};