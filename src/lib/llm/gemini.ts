export class GeminiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiClientError";
  }
}

export async function generateGeminiReply(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiClientError("GEMINI_API_KEY environment variable not found");
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `[System]\n${systemPrompt}\n\n[User input]\n${userPrompt}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new GeminiClientError(`Gemini API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts
      .map((part: { text?: unknown }) =>
        typeof part?.text === "string" ? part.text : ""
      )
      .join("")
      .trim()
    : "";
  if (!text) {
    throw new GeminiClientError("Gemini returned an empty response");
  }
  return text;
}
