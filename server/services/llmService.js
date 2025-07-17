const axios = require("axios");
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendRequestToOpenAI(model, message) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: message }],
        max_tokens: 1024,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error(
        `Error sending request to OpenAI (attempt ${i + 1}):`,
        error.message,
        error.stack
      );
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
}

async function sendRequestToAnthropic(model, message) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await anthropic.messages.create({
        model: model,
        messages: [{ role: "user", content: message }],
        max_tokens: 1024,
      });
      return response.content[0].text;
    } catch (error) {
      console.error(
        `Error sending request to Anthropic (attempt ${i + 1}):`,
        error.message,
        error.stack
      );
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
}

async function sendLLMRequest(provider, model, message) {
  switch (provider.toLowerCase()) {
    case "openai":
      return sendRequestToOpenAI(model, message);
    case "anthropic":
      return sendRequestToAnthropic(model, message);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

const generateBandBio = async (
  bandName,
  genre,
  model = "claude-3-haiku-20240307"
) => {
  const message = `Generate a short band biography for "${bandName}", a ${genre} band. Keep it to 2-3 sentences, professional but engaging. Focus on their musical style and impact.`;

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a music journalist writing band biographies.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error generating band bio: ${error.message}`);
    throw new Error("Failed to generate band biography");
  }
};

module.exports = {
  sendLLMRequest,
};
