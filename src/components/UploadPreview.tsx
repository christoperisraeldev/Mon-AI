
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUploadResult } from "@/types/education";
import { FileText, Image, File, X, Eye } from "lucide-react";

interface UploadPreviewProps {
  files: FileUploadResult[];
  onRemoveFile: (index: number) => void;
  onPreviewFile: (file: FileUploadResult) => void;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ 
  files, 
  onRemoveFile, 
  onPreviewFile 
}) => {
  const getFileIcon = (type: string) => {
    // Add null/undefined check and provide default
    if (!type) return <File className="h-5 w-5" />;
    
    if (type.includes('image')) return <Image className="h-5 w-5" />;
    if (type === 'pdf') return <FileText className="h-5 w-5 text-red-600" />;
    if (type === 'docx') return <FileText className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5" />;
  };

  const getFileTypeColor = (type: string) => {
    // Add null/undefined check and provide default
    if (!type) return 'bg-gray-100 text-gray-800';
    
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'docx': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getContentPreview = (content: string) => {
    const preview = content.length > 150 ? content.substring(0, 150) + '...' : content;
    return preview;
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Uploaded Files ({files.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getFileIcon(file.type || '')}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.filename}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getFileTypeColor(file.type || '')}>
                        {(file.type || 'unknown').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                      <span className="text-sm text-gray-500">
                        • Processed {new Date(file.extractedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {/* Content Preview */}
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-2">Extracted Content Preview:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {getContentPreview(file.content)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewFile(file)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Memory Integration:</strong> Content from these files is now part of your AI assistant's knowledge base 
            and will be used to provide more accurate, context-aware answers to your questions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPreview;
