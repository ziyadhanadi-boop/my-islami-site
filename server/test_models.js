const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API Key found');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // There is no direct listModels in the SDK easily without iterating or similar
    // Actually, we can just try 'gemini-1.5-flash' and see if it works with 'v1' instead of 'v1beta'
    // But the SDK uses 'v1beta' by default or 'v1'
    console.log('Testing gemini-1.5-flash-latest...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hi");
    console.log('Success with gemini-1.5-flash-latest:', (await result.response).text());
  } catch (err) {
    console.error('Failed with gemini-1.5-flash-latest:', err.message);
    try {
        console.log('Testing gemini-pro...');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log('Success with gemini-pro:', (await result.response).text());
    } catch (err2) {
        console.error('Failed with gemini-pro:', err2.message);
        try {
            console.log('Testing gemini-1.5-flash...');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hi");
            console.log('Success with gemini-1.5-flash:', (await result.response).text());
        } catch (err3) {
            console.error('Failed with gemini-1.5-flash:', err3.message);
        }
    }
  }
}

listModels();
