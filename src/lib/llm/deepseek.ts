export class DeepSeekError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeepSeekError";
  }
}

export async function callDeepSeek<T = unknown>(
  systemPrompt: string,
  userPrompt: string,
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new DeepSeekError("DEEPSEEK_API_KEY environment variable not found");
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
      response_format: { type: "json_object" },
      temperature: options.temperature ?? 0.8,
      max_tokens: options.maxTokens ?? 4000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new DeepSeekError(`DeepSeek API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new DeepSeekError("DeepSeek returned an empty response");
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    throw new DeepSeekError("Could not parse the JSON returned by DeepSeek");
  }
}
