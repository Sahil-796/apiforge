const express = require('express')
const router = express.Router();


router.post('/generateData', async (req, res) => {
    try {
    const { message } = req.body.prompt;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }


    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
      contents: [
        {
          parts: [
            { text: message }
          ]
        }
      ],
      tools: [
        {
          google_search: {}
        }
      ]
    },
      {
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
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
      
      res.json({
        success: true,
        response: textParts,
        fullResponse: geminiResponse
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