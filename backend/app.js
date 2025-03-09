const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const audioRoutes = require('./routes/audioRoutes');

const app = express();
const PORT = 5001; // Changed to 5001

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.get('/test', (req, res) => {
  res.send('Server is alive!');
});

app.use('/api/audio', audioRoutes);

mongoose.connect('mongodb+srv://madhavan:madhavan@cluster0.7q2an.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});