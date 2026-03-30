const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-pro-latest",
    "gemini-1.5-pro"
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`SUCCESS with ${modelName}:`, response.text());
      return; // Stop after first success
    } catch (err) {
      console.error(`FAILED with ${modelName}:`, err.message);
    }
  }
}

testModels();
