const axios = require('axios');
require('dotenv').config();

async function testFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    console.log('Testing with direct fetch (v1)...');
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: "Hello" }] }]
    });
    console.log('Success with direct fetch (v1):', response.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error('Error with direct fetch (v1):', err.response ? err.response.data : err.message);
    
    // Try v1beta
    const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    try {
        console.log('Testing with direct fetch (v1beta)...');
        const responseBeta = await axios.post(urlBeta, {
          contents: [{ parts: [{ text: "Hello" }] }]
        });
        console.log('Success with direct fetch (v1beta):', responseBeta.data.candidates[0].content.parts[0].text);
    } catch (errBeta) {
        console.error('Error with direct fetch (v1beta):', errBeta.response ? errBeta.response.data : errBeta.message);
    }
  }
}

testFetch();
