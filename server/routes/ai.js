const express = require('express')
const router = express.Router();
const axios = require('axios')
require('dotenv').config()

router.post('/generateData', async (req, res) => {
  
    try {

    const schema = typeof req.body.schema === 'string' ? req.body.schema : JSON.stringify(req.body.schema);
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Add explicit instruction to always use Google Search for real-world facts
    const message = `You are a helpful AI assistant for a mock API generator. Follow the prompt strictly listen to the number of instances specified and details of the data too. Your task is to generate only an array of documents, strictly following the JSON schema provided below. Do not include any explanations, comments, or extra text—just the array. Ensure the output is easily convertible to JSON on the frontend. If the prompt asks for real-world facts (like sports results, current events, or up-to-date information), you MUST ALWAYS use the Google Search tool to find the latest and most accurate answer before generating your response.\n\nJSON Schema:\n${schema}`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent',
      {
      "system_instruction": {
        "parts": [
        { "text": message }
        ]
      },
      "contents": [
        {
        "role": "user",
        "parts": [
          { "text": prompt }
        ]
        }
      ],
      "tools": [
        {
        "googleSearch": {}
        }
      ],
      },
      {
      headers: {
        'x-goog-api-key': process.env.GOOGLE_API_KEY,
        'Content-Type': 'application/json'
      }
      }
    );


    // Extract and return the response
    const geminiResponse = response.data;
    const candidate = geminiResponse.candidates?.[0];

    
    if (candidate?.content?.parts) {
      const textParts = candidate.content.parts
        .filter(part => part.text)
        .map(part => part.text)
        .join('\n');

      
      
      let jsonResponse;
      try {
        // Remove Markdown code block if present
        const cleaned = textParts.replace(/^\s*```(?:json)?\s*|```\s*$/g, '');
        jsonResponse = JSON.parse(cleaned);
      } catch (e) {
        // If parsing fails, return the raw text
        return res.json({
          success: false,
          error: 'Failed to parse JSON from Gemini response',
          rawResponse: textParts
        });
      }

      res.json({
        success: true,
        response: jsonResponse,
      });
    } else {
      res.json({
        success: true,
        response: 'No response generated',
        fullResponse: geminiResponse
      });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from Gemini',
      details: error.response?.data || error.message
    });
  }
})


router.post('/generateLogic', async (req, res) => {
  try {
    const schema = typeof req.body.schema === 'string' ? req.body.schema : JSON.stringify(req.body.schema);
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Explicitly instruct to generate only logic, not example data or objects
    const message = `You are a helpful AI assistant for a mock API POST method logic generator. Your task is to generate only the logic (JavaScript code) for a POST method, strictly following the JSON schema and the prompt below. Do NOT generate any example data, objects, or sample values (like "Honda Civic" or similar). Only generate the code logic that processes the input according to the schema and prompt. Do not include explanations, comments, or extra text—just the code inside a function(input){} block. Output only the code inside the function.\n\nJSON Schema:\n${schema}`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent',
      {
        "system_instruction": {
          "parts": [
            { "text": message }
          ]
        },
        "contents": [
          {
            "role": "user",
            "parts": [
              { "text": prompt }
            ]
          }
        ],
      },
      {
        headers: {
          'x-goog-api-key': process.env.GOOGLE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract and return the response
    const geminiResponse = response.data;
    const candidate = geminiResponse.candidates?.[0];

    if (candidate?.content?.parts) {
      const textParts = candidate.content.parts
        .filter(part => part.text)
        .map(part => part.text)
        .join('\n');

      let jsonResponse;
      try {
        // Remove Markdown code block if present
        const cleaned = textParts.replace(/^\s*```(?:json|js|javascript)?\s*|```\s*$/g, '');
        jsonResponse = cleaned
      } catch (e) {
        // If parsing fails, return the raw text
        return res.json({
          success: false,
          error: 'Failed to parse JSON from Gemini response',
          rawResponse: textParts
        });
      }

      res.json({
        success: true,
        response: jsonResponse,
      });
    } else {
      res.json({
        success: true,
        response: 'No response generated',
        fullResponse: geminiResponse
      });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from Gemini',
      details: error.response?.data || error.message
    });
  }
});


module.exports = router;