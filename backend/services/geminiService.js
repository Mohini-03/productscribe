const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 15000;

function buildPrompt({ productName, category, price, tone, rawNotes }) {
  const toneGuide = {
    friendly: "warm, conversational, like a shopkeeper who knows the product well",
    professional: "polished, confident, retail-catalog quality",
    festive: "upbeat and celebratory, suited for a sale or festival promotion",
  }[tone] || "warm and conversational";

  return `You write short product descriptions for small and rural businesses selling online.

Product name: ${productName}
Category: ${category || "not specified"}
Price: ${price || "not specified"}
Seller's raw notes: ${rawNotes}

Write ONE product description in a ${toneGuide} tone.

Rules:
- 2 to 4 sentences, roughly 40-70 words.
- Turn the raw notes into flowing prose — don't just restate them as a list.
- Don't invent specific facts (material, size, origin) that aren't in the notes.
- No markdown, no headers, no quotation marks around the output.
- Output ONLY the description text, nothing else — no preamble like "Here's a description:".`;
}

class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

async function generateDescription(fields) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY is not configured on the server", 500);
  }

  const prompt = buildPrompt(fields);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new GeminiError("Gemini API timed out", 504);
    }
    throw new GeminiError("Could not reach Gemini API", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 429) {
    throw new GeminiError("Gemini API rate limit reached — try again shortly", 429);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Gemini API error:", res.status, body);
    throw new GeminiError(`Gemini API request failed (${res.status})`, 502);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || !text.trim()) {
    console.error("Gemini returned no usable text:", JSON.stringify(json).slice(0, 500));
    throw new GeminiError("Gemini API returned an empty response", 502);
  }

  return text.trim();
}

module.exports = { generateDescription, GeminiError };
