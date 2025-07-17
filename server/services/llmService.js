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

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateWithOpenAI(prompt, model = "gpt-3.5-turbo") {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async generateWithAnthropic(prompt, model = "claude-3-sonnet-20240229") {
    try {
      const message = await this.anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return message.content[0].text.trim();
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  async generateBandBio(bandName, genre, keyInfo = "") {
    const prompt = `Generate a compelling festival biography for the metal band "${bandName}" in the ${genre} genre. ${
      keyInfo ? `Additional info: ${keyInfo}` : ""
    } 

The bio should be:
- 2-3 paragraphs long
- Professional and engaging
- Suitable for a metal festival lineup
- Highlight their musical style and achievements
- End with excitement about their upcoming performance

Write in third person and make it festival-ready.`;

    try {
      // Try OpenAI first, fallback to Anthropic
      if (process.env.OPENAI_API_KEY) {
        return await this.generateWithOpenAI(prompt);
      } else if (process.env.ANTHROPIC_API_KEY) {
        return await this.generateWithAnthropic(prompt);
      } else {
        throw new Error("No LLM API keys configured");
      }
    } catch (error) {
      // Return a fallback bio if LLM services fail
      return `${bandName} is a powerful ${genre} band that brings intense energy and musical prowess to the metal scene. Known for their dynamic performances and compelling sound, they have established themselves as a formidable presence in the metal community. Get ready for an unforgettable performance that showcases the very best of ${genre} metal.`;
    }
  }

  async isConfigured() {
    return !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
  }
}

module.exports = new LLMService();
