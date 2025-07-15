import { createClient } from '@supabase/supabase-js';

interface Citation {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface AIResponse {
  answer: string;
  citations: Citation[];
}

export default async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Medical query is required" });

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) throw new Error("Perplexity API key not configured");

    // Create a race between the fetch and a timeout
    const timeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out (10s)")), 10000)
    );

    const response = await Promise.race([
      fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: `Output PURE JSON ONLY with NO additional text, headers, or disclaimers. 
                        DO NOT INCLUDE:
                        - Any headers (e.g., "AI Response")
                        - Confidence percentages
                        - Response timing
                        - "Powered by" footers
                        - Markdown formatting (#, *, **)
                        Format EXACTLY: {
                          "answer": "Symptoms:\\n- Item 1\\n- Item 2\\nDiagnosis:\\n...\\nTreatment:\\n...\\nReferences:\\n...",
                          "citations": [{"title":"...","url":"...","snippet":"...","relevance":0.X}]
                        }`
            },
            { 
              role: "user", 
              content: `MEDICAL QUERY: ${prompt}\n\nRESPONSE: Output ONLY valid JSON with no additional text`
            }
          ],
          temperature: 0.1,
          max_tokens: 3000,
        })
      }),
      timeout
    ]);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response content");
    }

    try {
      const result = JSON.parse(content) as AIResponse;
      return res.status(200).json(result);
    } catch (parseError) {
      // Lightweight JSON repair
      const repaired = content
        .replace(/(\w+):/g, '"$1":') 
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      
      const result = JSON.parse(repaired) as AIResponse;
      return res.status(200).json(result);
    }
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: err.message });
  }
}