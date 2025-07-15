
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Search, Trash2, Eye, Download, Calendar, FileText, Image } from "lucide-react";
import { FileUploadResult } from "@/types/education";
import { toast } from "@/hooks/use-toast";

interface FileManagerProps {
  files?: FileUploadResult[];
  onDeleteFile?: (index: number) => void;
  onViewFile?: (file: FileUploadResult) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ files: propFiles, onDeleteFile, onViewFile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileUploadResult[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load files from localStorage on mount
  useEffect(() => {
    const loadFilesFromStorage = () => {
      try {
        const storedFiles = localStorage.getItem('knowledge-base-files');
        if (storedFiles) {
          const parsedFiles = JSON.parse(storedFiles);
          // Convert old format to new format if needed
          const convertedFiles = parsedFiles.map((file: any) => {
            if (file.content && file.filename) {
              return {
                filename: file.filename,
                content: file.content,
                type: file.format || file.type || 'text',
                size: file.size || 0,
                extractedAt: file.timestamp || file.extractedAt || new Date().toISOString()
              };
            }
            return file;
          }).filter((file: any) => file.filename && file.content);
          
          setFiles(convertedFiles);
        }
      } catch (error) {
        console.error('Failed to load files from storage:', error);
      }
    };

    loadFilesFromStorage();

    // Listen for storage changes (when files are uploaded in AdminPanel)
    const handleStorageChange = () => {
      loadFilesFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from AdminPanel
    window.addEventListener('knowledgeBaseUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('knowledgeBaseUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by file type
    if (selectedType !== 'all') {
      filtered = filtered.filter(file => file.type === selectedType);
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, selectedType]);

  const getFileTypes = () => {
    const types = [...new Set(files.map(file => file.type))];
    return types;
  };

  const getFileStats = () => {
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const typeCount = getFileTypes().reduce((acc, type) => {
      acc[type] = files.filter(file => file.type === type).length;
      return acc;
    }, {} as { [key: string]: number });

    return { totalSize, typeCount };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleViewFile = (file: FileUploadResult) => {
    if (onViewFile) {
      onViewFile(file);
    } else {
      // Default view behavior - show content in modal or new tab
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadFile = (file: FileUploadResult) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.filename}-extracted-content.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteFile = (index: number) => {
    const fileToDelete = filteredFiles[index];
    const originalIndex = files.findIndex(f => f.filename === fileToDelete.filename);
    
    if (originalIndex >= 0) {
      const updatedFiles = files.filter((_, i) => i !== originalIndex);
      setFiles(updatedFiles);
      localStorage.setItem('knowledge-base-files', JSON.stringify(updatedFiles));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('knowledgeBaseUpdated'));
      
      toast({
        title: "File Removed",
        description: "File has been removed from the knowledge base",
      });
    }

    if (onDeleteFile) {
      onDeleteFile(index);
    }
  };

  const getFileIcon = (type: string) => {
    if (!type) return <File className="h-5 w-5" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-green-600" />;
    if (type === 'pdf') return <FileText className="h-5 w-5 text-red-600" />;
    if (type === 'docx') return <FileText className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5" />;
  };

  const stats = getFileStats();

  return (
    <div className="space-y-6">
      {/* File Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{files.length}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{formatFileSize(stats.totalSize)}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.typeCount).length}</div>
              <div className="text-sm text-muted-foreground">File Types</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {files.reduce((sum, file) => sum + file.content.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Characters</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(stats.typeCount).map(([type, count]) => (
              <Badge key={type} variant="outline">
                {type.toUpperCase()}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList>
              <TabsTrigger value="all">All Files ({files.length})</TabsTrigger>
              {getFileTypes().map(type => (
                <TabsTrigger key={type} value={type}>
                  {type.toUpperCase()} ({stats.typeCount[type]})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Files ({filteredFiles.length})
            {searchTerm && <span className="text-sm font-normal ml-2">- Filtered by "{searchTerm}"</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {files.length === 0 ? (
                <p>No files uploaded yet. Go to the Admin tab to upload files.</p>
              ) : (
                <p>No files match your search criteria</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <h3 className="font-medium">{file.filename}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size || 0)}</span>
                          <span>•</span>
                          <span>{file.content.length} characters</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(file.extractedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewFile(file)}
                        title="View content"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                        title="Download extracted content"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(index)}
                        className="text-destructive hover:text-destructive"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content preview */}
                  <div className="mt-3 p-3 bg-muted rounded text-sm">
                    <p className="text-muted-foreground truncate">
                      {file.content.length > 200 
                        ? file.content.substring(0, 200) + '...' 
                        : file.content
                      }
                    </p>
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

export default FileManager;
