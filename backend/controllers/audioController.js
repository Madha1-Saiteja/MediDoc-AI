const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, OGG allowed.'));
    }
  },
});

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File uploaded:', req.file.path);

    const transcriptText = 'This is a sample transcript from your audio file.';
    const pdfPath = `uploads/transcript-${Date.now()}.pdf`;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.fontSize(12).text(transcriptText, 100, 100);
    doc.end();

    stream.on('finish', () => {
      console.log('PDF generated at:', pdfPath);
      res.status(200).json({
        message: 'File uploaded and transcript generated.',
        pdfPath: pdfPath,
      });
    });

    stream.on('error', (err) => {
      console.error('PDF generation failed:', err);
      res.status(500).json({ message: 'Failed to generate transcript.', error: err.message });
    });
  } catch (error) {
    console.error('Error in uploadAudio:', error);
    res.status(500).json({ message: 'Server error during upload.', error: error.message });
  }
};

module.exports = { upload, uploadAudio };