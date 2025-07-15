import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BloomTaxonomy, DifficultyLevel, FileUploadResult } from "@/types/education";
import { fileProcessor } from "@/utils/fileProcessor";
import EducationModeSelector from "./EducationModeSelector";
import EducationDisplay from "./EducationDisplay";
import EducationGenerationSettings from "./EducationGenerationSettings";
import EducationContentInput from "./EducationContentInput";
import { useEducationGenerator } from "@/hooks/useEducationGenerator";

// Define the structure of knowledge base files
interface KnowledgeBaseFile {
  id: number;
  filename: string;
  content: string;
  type: string;
  size: number;
  uploadedAt: string;
  tags: string[];
}

const EducationGenerator = () => {
  const {
    sourceText,
    setSourceText,
    isGenerating,
    generatedContent,
    setGeneratedContent,
    generateEducationContent
  } = useEducationGenerator();

  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  // Education settings
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [thinkingLevel, setThinkingLevel] = useState<BloomTaxonomy>('understand');
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [mcqCount, setMcqCount] = useState(3);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const saveToKnowledgeBase = (files: FileUploadResult[]) => {
    try {
      const existingFiles = JSON.parse(localStorage.getItem('knowledge-base-files') || '[]');
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.filename,
        content: file.content,
        type: file.type,
        size: file.size,
        uploadedAt: file.extractedAt,
        tags: ['education-upload']
      }));
      
      const updatedFiles = [...existingFiles, ...newFiles];
      localStorage.setItem('knowledge-base-files', JSON.stringify(updatedFiles));
      
      console.log('Saved to knowledge base:', newFiles.length, 'files');
    } catch (error) {
      console.error('Failed to save to knowledge base:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingFile(true);

    try {
      const processedFiles: FileUploadResult[] = [];
      
      for (const file of files) {
        const result = await fileProcessor.processFile(file);
        processedFiles.push(result);
      }

      setUploadedFiles(prev => [...prev, ...processedFiles]);
      saveToKnowledgeBase(processedFiles);
      
      const combinedContent = processedFiles.map(f => f.content).join('\n\n');
      setSourceText(prev => prev ? `${prev}\n\n${combinedContent}` : combinedContent);
      
      toast({
        title: "Files Processed",
        description: `${processedFiles.length} file(s) processed and added to knowledge base`,
      });

      if (autoGenerate && combinedContent.trim()) {
        handleGenerate(combinedContent);
      }

    } catch (error) {
      console.error('File processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process uploaded files",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    const removedFile = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    const newSourceText = sourceText.replace(removedFile.content, '').replace(/\n\n\n+/g, '\n\n').trim();
    setSourceText(newSourceText);
    
    toast({
      title: "File Removed",
      description: "File content removed from generator",
    });
  };

  const handleGenerate = async (textToProcess?: string) => {
    const contentToProcess = textToProcess || sourceText;
    
    if (!contentToProcess.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text or upload files to generate educational content",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateEducationContent(contentToProcess, flashcardCount, mcqCount, difficulty, thinkingLevel);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const loadFromKnowledgeBase = () => {
    const knowledgeBaseFiles: KnowledgeBaseFile[] = JSON.parse(
      localStorage.getItem('knowledge-base-files') || '[]'
    );
    
    if (knowledgeBaseFiles.length === 0) {
      toast({
        title: "No Files Found",
        description: "No files found in knowledge base. Upload files in the Admin tab first.",
        variant: "destructive",
      });
      return;
    }

    const combinedContent = knowledgeBaseFiles.map(file => file.content).join('\n\n');
    setSourceText(combinedContent);
    
    toast({
      title: "Content Loaded",
      description: `Loaded content from ${knowledgeBaseFiles.length} files in knowledge base`,
    });

    if (autoGenerate) {
      handleGenerate(combinedContent);
    }
  };

  const clearAll = () => {
    setSourceText('');
    setUploadedFiles([]);
    setGeneratedContent(null);
    toast({
      title: "Cleared",
      description: "All content and generated materials cleared",
    });
  };

  return (
    <div className="space-y-6">
      <EducationModeSelector
        difficulty={difficulty}
        thinkingLevel={thinkingLevel}
        onDifficultyChange={setDifficulty}
        onThinkingLevelChange={setThinkingLevel}
      />

      <EducationGenerationSettings
        flashcardCount={flashcardCount}
        mcqCount={mcqCount}
        autoGenerate={autoGenerate}
        onFlashcardCountChange={setFlashcardCount}
        onMcqCountChange={setMcqCount}
        onAutoGenerateChange={setAutoGenerate}
      />

      <EducationContentInput
        sourceText={sourceText}
        uploadedFiles={uploadedFiles}
        isProcessingFile={isProcessingFile}
        onSourceTextChange={setSourceText}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeUploadedFile}
        onLoadFromKnowledgeBase={loadFromKnowledgeBase}
        isGenerating={isGenerating}
      />

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={clearAll} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
        
        <Button 
          onClick={() => handleGenerate()}
          disabled={isGenerating || (!sourceText.trim() && uploadedFiles.length === 0)}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Flashcards & MCQs
            </>
          )}
        </Button>
      </div>

      {generatedContent && (
        <EducationDisplay content={generatedContent} />
      )}
    </div>
  );
};

export default EducationGenerator;