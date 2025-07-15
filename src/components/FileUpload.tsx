import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Image, FileText, X, Check, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FileUploadResult } from "@/types/education";
import { fileProcessor } from "@/utils/fileProcessor";

interface FileUploadProps {
  onFilesProcessed?: (files: FileUploadResult[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesProcessed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  const [processingFiles, setProcessingFiles] = useState<{ [key: string]: number }>({});

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  }, []);

  const processFiles = async (files: File[]) => {
    const supportedMimeTypes = fileProcessor.getSupportedMimeTypes();
    
    for (const file of files) {
      if (!supportedMimeTypes.includes(file.type)) {
        toast({
          title: "Unsupported File Type",
          description: `${file.name} (${file.type}) is not supported. Please upload PDF, DOCX, text, or image files.`,
          variant: "destructive",
        });
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      setProcessingFiles(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProcessingFiles(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
          }));
        }, 200);

        const result = await fileProcessor.processFile(file);
        
        clearInterval(progressInterval);
        setProcessingFiles(prev => ({ ...prev, [fileId]: 100 }));
        
        setTimeout(() => {
          setProcessingFiles(prev => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
          });
          
          setUploadedFiles(prev => [...prev, result]);
          
          toast({
            title: "File Processed Successfully",
            description: `${file.name} has been processed and added to knowledge base`,
          });
        }, 500);

      } catch (error) {
        console.error('File processing failed:', error);
        setProcessingFiles(prev => {
          const newState = { ...prev };
          delete newState[fileId];
          return newState;
        });
        
        toast({
          title: "Processing Failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }

    // Notify parent component
    if (onFilesProcessed && uploadedFiles.length > 0) {
      onFilesProcessed(uploadedFiles);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-4 w-4" />;
    if (type === 'pdf') return <FileText className="h-4 w-4" />;
    if (type === 'docx') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'docx': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>File Upload & Processing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, DOCX, TXT, Images (PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, JFIF, SVG)
            </p>
            <input
              type="file"
              multiple
              accept={fileProcessor.getSupportedFileTypes().join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Files */}
      {Object.keys(processingFiles).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(processingFiles).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{fileId.split('-')[0]}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB • Processed {new Date(file.extractedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getFileTypeColor(file.type)}>
                      {file.type.toUpperCase()}
                    </Badge>
                    <Check className="h-4 w-4 text-green-600" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Upload documents to inject content into the knowledge base</li>
                <li>• Processed content will be used to answer relevant queries</li>
                <li>• PDFs and DOCX files are converted to text automatically</li>
                <li>• Images are processed using OCR to extract text content</li>
                <li>• Files are stored locally and content is indexed for search</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
