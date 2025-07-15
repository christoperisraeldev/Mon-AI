export interface QueryResult {
  answer: string;
  tier: "custom" | "scholar" | "web" | "comprehensive";
  citations: Array<{
    source: string;
    score: number;
    snippet: string;
    url?: string;
    type?: 'custom' | 'web';
  }>;
  metadata: {
    processingTime: number;
    confidence: number;
  };
  responseType?: 'brainstorm' | 'resident' | 'note_generation';
  billingCode?: string;
  specialty?: string;
  customAnswer?: string;
  webAnswer?: string;
}

export const simulateQuery = async (question: string, specialty?: string): Promise<QueryResult> => {
  console.log('Processing query:', question);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // User-friendly service unavailable message
  const answer = `I'm currently unable to process your request as the AI service has been temporarily disabled. 
  
While we work to restore this functionality, you can:

1. Browse your uploaded documents in the Knowledge Base
2. Use the search feature to find specific content
3. Contact support for assistance with urgent requests

We apologize for the inconvenience and appreciate your patience.`;

  return {
    answer,
    tier: "web",
    citations: [
      {
        source: "Service Status",
        score: 0.95,
        snippet: "AI features are temporarily unavailable",
        url: "https://example.com/service-status",
        type: 'web'
      },
      {
        source: "Knowledge Base",
        score: 0.85,
        snippet: "Your uploaded documents are still accessible for manual review",
        type: 'custom'
      }
    ],
    metadata: {
      processingTime: 800,
      confidence: 0.9
    }
  };
};

export const getAvailableModels = async (): Promise<string[]> => {
  return ["Service Disabled - Check Back Later"];
};