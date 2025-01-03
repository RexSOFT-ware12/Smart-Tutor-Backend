const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to generate a question based on input text
app.post("/generate-question", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // OpenAI API call to generate a question
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a question generator." },
        { role: "user", content: `Generate a question based on: ${text}` },
      ],
      response_format: "text",
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the generated question
    const generatedQuestion = response.choices[0].message.content;

    // Send the question back to the client
    res.status(200).json({ question: generatedQuestion });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});