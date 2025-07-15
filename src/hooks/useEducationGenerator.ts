import { useState } from 'react';
import { BloomTaxonomy, DifficultyLevel, EducationContent } from "@/types/education";
import { toast } from "@/hooks/use-toast";
import { extractIntelligentConcepts } from "@/utils/conceptExtractor";
import { generateFlashcardsFromConcepts, generateMCQsFromConcepts } from "@/utils/educationContentGenerator";

export const useEducationGenerator = () => {
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<EducationContent | null>(null);

  const generateEducationContent = async (
    contentToProcess: string,
    flashcardCount: number,
    mcqCount: number,
    difficulty: DifficultyLevel,
    thinkingLevel: BloomTaxonomy
  ): Promise<EducationContent> => {
    if (!contentToProcess.trim()) {
      throw new Error('No content provided for generation');
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      // Extract key concepts - get enough for both flashcards and MCQs
      const totalConceptsNeeded = flashcardCount + mcqCount;
      const concepts = extractIntelligentConcepts(contentToProcess);
      
      if (concepts.length === 0) {
        throw new Error('No educational concepts could be extracted from the provided content');
      }
      
      // Split concepts between flashcards and MCQs
      const flashcardConcepts = concepts.slice(0, flashcardCount);
      const mcqConcepts = concepts.slice(flashcardCount, flashcardCount + mcqCount);
      
      // Parallel generation for efficiency
      const [flashcards, mcqs] = await Promise.all([
        generateFlashcardsFromConcepts(flashcardConcepts, flashcardCount, difficulty, thinkingLevel),
        generateMCQsFromConcepts(mcqConcepts, mcqCount, difficulty, thinkingLevel)
      ]);

      const processingTime = Date.now() - startTime;
      
      const content: EducationContent = {
        flashcards,
        mcqs,
        metadata: {
          sourceText: contentToProcess.substring(0, 200) + (contentToProcess.length > 200 ? '...' : ''),
          sourceLength: contentToProcess.length,
          difficulty,
          bloomLevel: thinkingLevel,
          flashcardCount: flashcards.length,
          mcqCount: mcqs.length,
          generatedAt: new Date().toISOString(),
          processingTime,
          conceptsCount: concepts.length
        }
      };

      setGeneratedContent(content);
      
      toast({
        title: "Content Generated Successfully",
        description: `Created ${flashcards.length} flashcards and ${mcqs.length} MCQs from ${concepts.length} concepts`,
      });

      return content;
      
    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    sourceText,
    setSourceText,
    isGenerating,
    generatedContent,
    setGeneratedContent,
    generateEducationContent
  };
};