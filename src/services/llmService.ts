// Define proper types for the service
interface ServiceFlashcard {
  id: string;
  question: string;
  answer: string;
}

interface ServiceMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Define types for medical sources
export interface TrustedSource {
  title: string;
  url: string;
  api: boolean;
  pattern: string;
}

export interface BookSource {
  title: string;
  url: string;
}

export interface MedicalSourcesData {
  trusted: TrustedSource[];
  books: BookSource[];
}

export interface BillingCodes {
  [specialty: string]: {
    [code: string]: string;
  };
}

// Define types for Perplexity API
interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Get API key from Vite environment
const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;

// Helper function for Perplexity API requests
const perplexityRequest = async (
  messages: PerplexityMessage[],
  jsonMode: boolean = false
): Promise<string> => {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'pplx-70b-online',
      messages,
      temperature: 0.2,
      max_tokens: 1500,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data: PerplexityResponse = await response.json();
  return data.choices[0]?.message?.content || '';
};

export const llmService = {
  async analyzeContent(request: {
    content: string;
    context: string;
  }): Promise<string[]> {
    try {
      const content = await perplexityRequest([
        {
          role: 'system',
          content: `You are a medical expert. Analyze the following content and extract key medical concepts: ${request.context}`,
        },
        {
          role: 'user',
          content: `Analyze this medical content and return ONLY a comma-separated list of key concepts: ${request.content}`,
        },
      ]);

      return content
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    } catch (error) {
      console.error('Error analyzing content:', error);
      return [];
    }
  },

  async generateQuestions(request: {
    concepts: string[];
    count: number;
    type: 'flashcard' | 'mcq';
    difficulty: string;
    bloomLevel: string;
  }): Promise<ServiceFlashcard[] | ServiceMCQ[]> {
    try {
      const prompt = `Create ${request.count} ${
        request.type === 'flashcard' ? 'flashcards' : 'multiple choice questions'
      } 
        about these medical concepts: ${request.concepts.join(', ')}. 
        Difficulty: ${request.difficulty}, Bloom's Level: ${request.bloomLevel}.
        For flashcards, provide clear questions and detailed answers. 
        For MCQs, provide 4 options and indicate the correct one.
        Return ONLY a JSON array of questions without additional text.`;

      const content = await perplexityRequest(
        [
          {
            role: 'system',
            content: `You are a medical education specialist. Return questions in JSON format: ${
              request.type === 'flashcard'
                ? '[{ "id": "unique-id", "question": "...", "answer": "..." }]'
                : '[{ "id": "unique-id", "question": "...", "options": ["...", ...], "correctAnswer": 0 }]'
            }`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        true
      );

      if (!content) throw new Error('No response from AI');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions');
    }
  },
};

// Add typed exports
export const MEDICAL_SOURCES: MedicalSourcesData = {
  trusted: [
    {
      title: 'CDC',
      url: 'https://www.cdc.gov/',
      api: true,
      pattern: 'Disease control and prevention guidelines',
    },
    {
      title: 'PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/',
      api: true,
      pattern: 'Biomedical literature database',
    },
    {
      title: 'World Health Organization (WHO)',
      url: 'https://www.who.int/',
      api: false,
      pattern: 'Global health guidelines and data',
    },
  ],
  books: [
    {
      title: "Gray's Anatomy",
      url: 'https://example.com/grays-anatomy',
    },
    {
      title: "Harrison's Principles of Internal Medicine",
      url: 'https://example.com/harrisons',
    },
  ],
};

export const BILLING_CODES: BillingCodes = {
  'General Practice': {
    '12345': 'Consultation, Level A',
    '12346': 'Consultation, Level B',
  },
  Cardiology: {
    '23456': 'Echocardiography',
    '23457': 'Stress Test',
  },
};