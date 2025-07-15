// Replace this entire file with the following code:
import { BloomTaxonomy, DifficultyLevel, FlashcardOutput, MCQOutput } from "@/types/education";
import { ExtractedConcept } from "./conceptExtractor";

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Question starters based on Bloom's Taxonomy
const bloomQuestionStarters: Record<BloomTaxonomy, string[]> = {
  remember: ["What is", "Define", "Identify", "List", "Recall"],
  understand: ["Explain in your own words", "Describe", "Interpret", "Summarize", "Paraphrase"],
  apply: ["How would you use", "Demonstrate", "Solve", "Implement", "Apply"],
  analyze: ["Compare and contrast", "Analyze", "Differentiate", "Examine", "Investigate"],
  evaluate: ["Evaluate", "Justify", "Critique", "Assess", "Recommend"],
  create: ["Design", "Create", "Develop", "Propose", "Invent"]
};

// Generate intelligent flashcard questions
const generateIntelligentQuestion = (concept: ExtractedConcept, level: BloomTaxonomy): string => {
  const starters = bloomQuestionStarters[level];
  const starter = starters[Math.floor(Math.random() * starters.length)];
  const conceptText = concept.text.replace(/[.!?]$/, ''); // Remove trailing punctuation
  
  // Create a focused question about the concept
  return `${starter} ${conceptText.split(' ').slice(0, 5).join(' ')}?`;
};

// Generate intelligent answers
const generateIntelligentAnswer = (concept: ExtractedConcept): string => {
  // Directly use the concept text as the answer
  return concept.text.substring(0, 120);
};

// Generate intelligent MCQ questions
const generateIntelligentMCQQuestion = (concept: ExtractedConcept, level: BloomTaxonomy): string => {
  const starters = bloomQuestionStarters[level];
  const starter = starters[Math.floor(Math.random() * starters.length)];
  const conceptText = concept.text.replace(/[.!?]$/, ''); // Remove trailing punctuation
  
  // Create a focused MCQ question
  return `${starter} ${conceptText.split(' ').slice(0, 5).join(' ')}?`;
};

// Generate intelligent MCQ options
const generateIntelligentMCQOptions = (concept: ExtractedConcept): string[] => {
  const correctOption = concept.text.substring(0, 60);
  
  // Create plausible distractors
  return [
    correctOption,
    `Alternative perspective on ${concept.text.split(' ').slice(0, 2).join(' ')}`,
    `Common misconception about ${concept.text.split(' ').slice(0, 2).join(' ')}`,
    `Historical context of ${concept.text.split(' ').slice(0, 2).join(' ')}`
  ];
};

export const generateFlashcardsFromConcepts = (
  concepts: ExtractedConcept[], 
  flashcardCount: number, 
  difficulty: DifficultyLevel, 
  thinkingLevel: BloomTaxonomy
): FlashcardOutput[] => {
  return concepts.slice(0, flashcardCount).map((concept) => {
    const question = generateIntelligentQuestion(concept, thinkingLevel);
    const answer = generateIntelligentAnswer(concept);
    
    return {
      id: generateId('flashcard'),
      question,
      answer,
      difficulty,
      bloomLevel: thinkingLevel,
      category: concept.type === 'definition' ? 'Definitions' : 
               concept.type === 'fact' ? 'Key Facts' :
               concept.type === 'process' ? 'Processes' : 'Concepts',
      tags: ['auto-generated', difficulty, thinkingLevel, concept.type],
    };
  });
};

export const generateMCQsFromConcepts = (
  concepts: ExtractedConcept[], 
  mcqCount: number, 
  difficulty: DifficultyLevel, 
  thinkingLevel: BloomTaxonomy
): MCQOutput[] => {
  return concepts.slice(0, mcqCount).map((concept) => {
    const question = generateIntelligentMCQQuestion(concept, thinkingLevel);
    const options = generateIntelligentMCQOptions(concept);
    
    // Shuffle options to avoid always having correct answer first
    const correctAnswer = 0;
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    return {
      id: generateId('mcq'),
      question,
      options: shuffledOptions,
      correctAnswer: shuffledOptions.indexOf(options[correctAnswer]),
      explanation: `Based on: ${concept.text.substring(0, 80)}...`,
      difficulty,
      bloomLevel: thinkingLevel,
      category: concept.type === 'definition' ? 'Definitions' : 
               concept.type === 'fact' ? 'Key Facts' :
               concept.type === 'process' ? 'Processes' : 'Concepts',
      tags: ['auto-generated', difficulty, thinkingLevel, concept.type, 'mcq'],
    };
  });
};