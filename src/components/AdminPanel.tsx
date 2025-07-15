import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle, AlertCircle, Trash2, FileText, Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FileUploadResult } from "@/types/education";
import { fileProcessor } from "@/utils/fileProcessor";

interface UploadedFile {
  id: number;
  filename: string;
  size: string;
  status: 'success' | 'failed';
  timestamp: string;
  format: string;
  content: string;
}

const AdminPanel = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<{ [key: string]: number }>({});
  const [uploadHistory, setUploadHistory] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem('knowledge-base-files');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever uploadHistory changes
  useEffect(() => {
    localStorage.setItem('knowledge-base-files', JSON.stringify(uploadHistory));
    window.dispatchEvent(new CustomEvent('knowledgeBaseUpdated'));
  }, [uploadHistory]);

  // Define processFiles FIRST before other functions that use it
  const processFiles = useCallback(async (files: File[]) => {
    const supportedMimeTypes = fileProcessor.getSupportedMimeTypes();
    
    for (const file of files) {
      if (!supportedMimeTypes.includes(file.type)) {
        toast({
          title: "Unsupported File Type",
          description: `${file.name} (${file.type}) is not supported. Please upload supported file types.`,
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
          
          const newUpload: UploadedFile = {
            id: Date.now(),
            filename: result.filename,
            size: `${(result.size / 1024 / 1024).toFixed(1)} MB`,
            status: 'success',
            timestamp: new Date(result.extractedAt).toLocaleString(),
            format: result.type,
            content: result.content
          };
          
          setUploadHistory(prev => [newUpload, ...prev]);
          
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
  }, []);

  // Now define other functions that use processFiles
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
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const clearHistory = useCallback(() => {
    setUploadHistory([]);
    toast({
      title: "Knowledge Base Cleared",
      description: "All uploaded files have been removed from the knowledge base",
    });
  }, []);

  const removeFile = useCallback((id: number) => {
    setUploadHistory(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File Removed",
      description: "File has been removed from the knowledge base",
    });
  }, []);

  const getFileIcon = useCallback((type: string) => {
    if (!type) return <File className="h-5 w-5" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-green-600" />;
    if (type === 'pdf') return <FileText className="h-5 w-5 text-red-600" />;
    if (type === 'docx') return <FileText className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5" />;
  }, []);

  const getFileTypeColor = useCallback((type: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'docx': return 'bg-blue-100 text-blue-800';
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
      case 'tiff':
      case 'jfif':
      case 'svg':
        return 'bg-green-100 text-green-800';
      case 'text':
      case 'txt':
      case 'html':
      case 'md':
      case 'csv':
        return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Enhanced File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Expand Knowledge Base</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Upload documents to expand AI knowledge:</strong> PDF, DOCX, TXT, HTML, MD, CSV, and images (PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, JFIF, SVG, ICO) • Files are processed and stored locally
            </AlertDescription>
          </Alert>

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
              All uploaded content will be integrated into the AI's knowledge base for better responses
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

      {/* Knowledge Base Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Knowledge Base Files ({uploadHistory.length})</CardTitle>
            {uploadHistory.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {uploadHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No files uploaded yet</p>
              <p className="text-sm">Upload files to expand your AI's knowledge base</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadHistory.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getFileIcon(upload.format)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{upload.filename}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getFileTypeColor(upload.format)}>
                            {upload.format.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">{upload.size}</span>
                          <span className="text-sm text-gray-500">• {upload.timestamp}</span>
                        </div>
                        
                        {/* Content Preview */}
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-700 mb-2">Content Preview:</p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {upload.content.length > 200 
                              ? upload.content.substring(0, 200) + '...' 
                              : upload.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {upload.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <Button
                        onClick={() => removeFile(upload.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;