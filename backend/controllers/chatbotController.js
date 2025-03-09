const axios = require('axios');

const chatWithBot = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://127.0.0.1:5000/chat', { message });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to communicate with chatbot' });
  }
};

module.exports = {
  chatWithBot,
};