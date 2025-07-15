export type BloomTaxonomy = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface FlashcardOutput {
  id: string;
  question: string;
  answer: string;
  difficulty: DifficultyLevel;
  bloomLevel: BloomTaxonomy;
  tags: string[];
  category: string;
}

export interface MCQOutput {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  explanation?: string;
  difficulty: DifficultyLevel;
  bloomLevel: BloomTaxonomy;
  tags: string[];
  category: string;
}

export interface EducationContentMetadata {
  sourceText?: string;
  sourceLength: number;
  difficulty: DifficultyLevel;
  bloomLevel: BloomTaxonomy;
  flashcardCount: number;
  mcqCount: number;
  generatedAt: string;
  processingTime: number;
  conceptsCount: number; // Added this line
}

export interface EducationContent {
  flashcards: FlashcardOutput[];
  mcqs: MCQOutput[];
  metadata: EducationContentMetadata;
}

export interface FileUploadResult {
  filename: string;
  content: string;
  type: 'pdf' | 'docx' | 'image' | 'text';
  size: number;
  extractedAt: string;
}