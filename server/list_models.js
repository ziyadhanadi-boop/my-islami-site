const axios = require('axios');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    console.log('Listing models...');
    const response = await axios.get(url);
    console.log('Available models:');
    response.data.models.forEach(m => {
        console.log(`- ${m.name} (${m.displayName})`);
    });
  } catch (err) {
    console.error('Error listing models:', err.response ? err.response.data : err.message);
  }
}

listModels();
