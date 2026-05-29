import { generateGeminiReply, GeminiClientError } from "./gemini";
import { callDeepSeek } from "./deepseek";

function normalizeSpiritReply(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  // If provider stops mid-sentence, add a soft landing instead of exposing hard cutoff.
  if (/[.!?"')]$/.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed}.`;
}

/**
 * Companion guide dialogue LLM call; prefers Gemini, falls back to DeepSeek when Gemini is unavailable.
 */
export async function generateSpiritReply(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  // Try Gemini first
  try {
    const reply = await generateGeminiReply(systemPrompt, userPrompt);
    return normalizeSpiritReply(reply);
  } catch (err) {
    if (err instanceof GeminiClientError) {
      console.log(`[companion-guide] Gemini unavailable (${err.message}), falling back to DeepSeek`);
    } else {
      console.log("[companion-guide] Gemini unknown error, falling back to DeepSeek");
    }
  }

  // Fallback to DeepSeek
  try {
    const dsSystem = systemPrompt + "\n\nOutput requirement: output the reply text directly, do not output JSON.";
    const response = await callDeepSeekText(dsSystem, userPrompt);
    return normalizeSpiritReply(response);
  } catch {
    throw new Error("Both Gemini and DeepSeek are unavailable");
  }
}

/**
 * DeepSeek plain text mode (not JSON)
 */
async function callDeepSeekText(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not found");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek error: ${response.status}`);
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}
