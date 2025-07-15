import { BloomTaxonomy, DifficultyLevel, FlashcardOutput, MCQOutput, EducationContent } from '../types/education';

export interface EducationFormatterConfig {
  difficulty: DifficultyLevel;
  bloomLevel: BloomTaxonomy;
  flashcardCount: number;
  mcqCount: number;
  includeExplanations: boolean;
}

export class EducationFormatter {
  private bloomsKeywords = {
    remember: ['define', 'identify', 'list', 'name', 'state', 'recall', 'recognize'],
    understand: ['explain', 'describe', 'summarize', 'interpret', 'classify', 'compare'],
    apply: ['demonstrate', 'solve', 'use', 'calculate', 'modify', 'operate'],
    analyze: ['analyze', 'categorize', 'examine', 'investigate', 'differentiate'],
    evaluate: ['assess', 'critique', 'judge', 'evaluate', 'justify', 'rank'],
    create: ['design', 'develop', 'formulate', 'plan', 'construct', 'generate']
  };

  async formatContent(
    content: string, 
    config: EducationFormatterConfig
  ): Promise<EducationContent> {
    console.log('Formatting education content with config:', config);

    const flashcards = await this.generateFlashcards(content, config);
    const mcqs = await this.generateMCQs(content, config);

    return {
      flashcards,
      mcqs,
      metadata: {
        sourceLength: content.length,
        difficulty: config.difficulty,
        bloomLevel: config.bloomLevel,
        flashcardCount: config.flashcardCount,
        mcqCount: config.mcqCount,
        generatedAt: new Date().toISOString(),
        processingTime: Date.now()
      }
    };
  }

  private async generateFlashcards(
    content: string, 
    config: EducationFormatterConfig
  ): Promise<FlashcardOutput[]> {
    const flashcards: FlashcardOutput[] = [];
    const keyTerms = this.extractKeyTerms(content);
    const concepts = this.extractConcepts(content);

    // Generate flashcards based on difficulty level
    for (let i = 0; i < Math.min(config.flashcardCount, keyTerms.length + concepts.length); i++) {
      let question: string;
      let answer: string;

      if (i < keyTerms.length) {
        const term = keyTerms[i];
        question = this.generateQuestionByBloomLevel(term.term, term.context, config.bloomLevel, 'flashcard');
        answer = term.definition || term.context;
      } else {
        const concept = concepts[i - keyTerms.length];
        question = this.generateQuestionByBloomLevel(concept.title, concept.content, config.bloomLevel, 'flashcard');
        answer = concept.content;
      }

      flashcards.push({
        id: `fc_${i + 1}`,
        question,
        answer,
        difficulty: config.difficulty,
        bloomLevel: config.bloomLevel,
        tags: this.extractTags(content),
        category: this.determineCategory(content)
      });
    }

    return flashcards;
  }

  private async generateMCQs(
    content: string, 
    config: EducationFormatterConfig
  ): Promise<MCQOutput[]> {
    const mcqs: MCQOutput[] = [];
    const keyFacts = this.extractKeyFacts(content);

    for (let i = 0; i < Math.min(config.mcqCount, keyFacts.length); i++) {
      const fact = keyFacts[i];
      const question = this.generateQuestionByBloomLevel(fact.subject, fact.detail, config.bloomLevel, 'mcq');
      const correctAnswer = fact.detail;
      const distractors = this.generateDistractors(correctAnswer, fact.subject, content);

      const options = this.shuffleArray([correctAnswer, ...distractors]);
      const correctIndex = options.indexOf(correctAnswer);

      mcqs.push({
        id: `mcq_${i + 1}`,
        question,
        options,
        correctAnswer: correctIndex,
        explanation: config.includeExplanations ? 
          `The correct answer is "${correctAnswer}" because ${fact.reasoning || 'this is explicitly stated in the source material.'}` : 
          undefined,
        difficulty: config.difficulty,
        bloomLevel: config.bloomLevel,
        tags: this.extractTags(content),
        category: this.determineCategory(content)
      });
    }

    return mcqs;
  }

  private generateQuestionByBloomLevel(
    subject: string, 
    context: string, 
    bloomLevel: BloomTaxonomy, 
    type: 'flashcard' | 'mcq'
  ): string {
    const keywords = this.bloomsKeywords[bloomLevel];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    switch (bloomLevel) {
      case 'remember':
        return `What is ${subject}?`;
      case 'understand':
        return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} ${subject}.`;
      case 'apply':
        return `How would you ${randomKeyword} ${subject} in a practical situation?`;
      case 'analyze':
        return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} the components of ${subject}.`;
      case 'evaluate':
        return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} the effectiveness of ${subject}.`;
      case 'create':
        return `${randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1)} a new approach to ${subject}.`;
      default:
        return `What is ${subject}?`;
    }
  }

  private extractKeyTerms(content: string): Array<{term: string, definition?: string, context: string}> {
    const terms: Array<{term: string, definition?: string, context: string}> = [];
    const sentences = content.split(/[.!?]+/);

    for (const sentence of sentences) {
      // Look for definition patterns
      const definitionMatch = sentence.match(/(.+?)\s+(?:is|are|means?|refers? to)\s+(.+)/i);
      if (definitionMatch) {
        terms.push({
          term: definitionMatch[1].trim(),
          definition: definitionMatch[2].trim(),
          context: sentence.trim()
        });
      }

      // Look for important terms (capitalized, technical terms)
      const importantTerms = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (importantTerms) {
        for (const term of importantTerms) {
          if (term.length > 3 && !terms.some(t => t.term === term)) {
            terms.push({
              term,
              context: sentence.trim()
            });
          }
        }
      }
    }

    return terms.slice(0, 10); // Limit to top 10 terms
  }

  private extractConcepts(content: string): Array<{title: string, content: string}> {
    const concepts: Array<{title: string, content: string}> = [];
    const paragraphs = content.split(/\n\s*\n/);

    for (const paragraph of paragraphs) {
      if (paragraph.trim().length > 100) { // Only consider substantial paragraphs
        const firstSentence = paragraph.split(/[.!?]/)[0];
        concepts.push({
          title: firstSentence.substring(0, 50) + '...',
          content: paragraph.trim()
        });
      }
    }

    return concepts.slice(0, 5); // Limit to top 5 concepts
  }

  private extractKeyFacts(content: string): Array<{subject: string, detail: string, reasoning?: string}> {
    const facts: Array<{subject: string, detail: string, reasoning?: string}> = [];
    const sentences = content.split(/[.!?]+/);

    for (const sentence of sentences) {
      if (sentence.trim().length > 20) {
        // Look for factual statements
        const factMatch = sentence.match(/(.+?)\s+(?:causes?|results? in|leads? to|is caused by)\s+(.+)/i);
        if (factMatch) {
          facts.push({
            subject: factMatch[1].trim(),
            detail: factMatch[2].trim(),
            reasoning: `This is a cause-effect relationship stated in the source.`
          });
        } else {
          // Extract general facts
          const words = sentence.split(' ');
          if (words.length > 5 && words.length < 20) {
            facts.push({
              subject: words.slice(0, 3).join(' '),
              detail: sentence.trim()
            });
          }
        }
      }
    }

    return facts.slice(0, 8); // Limit to top 8 facts
  }

  private generateDistractors(correctAnswer: string, subject: string, context: string): string[] {
    const distractors: string[] = [];
    
    // Generate plausible but incorrect answers
    const words = correctAnswer.split(' ');
    
    // Type 1: Similar but different
    if (words.length > 1) {
      distractors.push(words.slice(0, -1).join(' ') + ' alternative');
    }
    
    // Type 2: Opposite or contrasting
    const opposites: { [key: string]: string } = {
      'increase': 'decrease',
      'positive': 'negative',
      'high': 'low',
      'large': 'small',
      'fast': 'slow',
      'effective': 'ineffective'
    };
    
    for (const [word, opposite] of Object.entries(opposites)) {
      if (correctAnswer.toLowerCase().includes(word)) {
        distractors.push(correctAnswer.toLowerCase().replace(word, opposite));
        break;
      }
    }
    
    // Type 3: Related but incorrect
    distractors.push(`Similar to ${correctAnswer.split(' ')[0]} but different`);
    
    // Ensure we have exactly 3 distractors
    while (distractors.length < 3) {
      distractors.push(`Alternative explanation for ${subject}`);
    }
    
    return distractors.slice(0, 3);
  }

  private extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // Medical tags
    if (content.toLowerCase().includes('medical') || content.toLowerCase().includes('health')) {
      tags.push('medical');
    }
    
    // Science tags
    if (content.toLowerCase().includes('research') || content.toLowerCase().includes('study')) {
      tags.push('research');
    }
    
    // Technology tags
    if (content.toLowerCase().includes('technology') || content.toLowerCase().includes('computer')) {
      tags.push('technology');
    }
    
    return tags.length > 0 ? tags : ['general'];
  }

  private determineCategory(content: string): string {
    if (content.toLowerCase().includes('medical') || content.toLowerCase().includes('health')) {
      return 'Medical';
    }
    
    if (content.toLowerCase().includes('technology') || content.toLowerCase().includes('computer')) {
      return 'Technology';
    }
    
    if (content.toLowerCase().includes('science') || content.toLowerCase().includes('research')) {
      return 'Science';
    }
    
    return 'General Knowledge';
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const educationFormatter = new EducationFormatter();
