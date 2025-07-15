
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Eye, Info, Loader2 } from "lucide-react";
import { FileUploadResult } from "@/types/education";

interface EducationContentInputProps {
  sourceText: string;
  uploadedFiles: FileUploadResult[];
  isProcessingFile: boolean;
  onSourceTextChange: (text: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onLoadFromKnowledgeBase: () => void;
  isGenerating: boolean;
}

const EducationContentInput: React.FC<EducationContentInputProps> = ({
  sourceText,
  uploadedFiles,
  isProcessingFile,
  onSourceTextChange,
  onFileUpload,
  onRemoveFile,
  onLoadFromKnowledgeBase,
  isGenerating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Content Sources</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="source-text">
                Enter or paste your educational content
              </Label>
              <Textarea
                id="source-text"
                placeholder="Paste your educational content here... The AI will intelligently extract key concepts, definitions, facts, and processes to create relevant flashcards and MCQs based on your selected learning level."
                value={sourceText}
                onChange={(e) => onSourceTextChange(e.target.value)}
                className="min-h-[200px] mt-2"
                disabled={isGenerating}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label>Upload Documents or Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload PDF, DOCX, or image files for automatic content extraction and knowledge base integration
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.bmp,.webp,.tiff,.txt,.md,.csv"
                  onChange={onFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline" disabled={isProcessingFile}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {isProcessingFile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing & Adding to Knowledge Base...
                      </>
                    ) : (
                      'Select Files'
                    )}
                  </label>
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.filename}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFile(index)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <div>
              <Label>Load from Knowledge Base</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Use content from files uploaded in the Admin tab or files uploaded here
              </p>
              <Button onClick={onLoadFromKnowledgeBase} variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Load Knowledge Base Content
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Intelligent Generation:</strong> The AI extracts definitions, key facts, processes, and cause-effect relationships 
            from your content to create contextually relevant flashcards and MCQs. Files uploaded here are automatically added to the knowledge base.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default EducationContentInput;