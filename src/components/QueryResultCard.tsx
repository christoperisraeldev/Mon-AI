import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { QueryResult } from "@/utils/apiSimulator";
import { ExternalLink, BookOpen, Download, GraduationCap, FileText } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface QueryResultCardProps {
  result: QueryResult;
  onDownloadFlashcards: () => void;
  onDownloadMCQs: () => void;
}

const QueryResultCard: React.FC<QueryResultCardProps> = ({
  result,
  onDownloadFlashcards,
  onDownloadMCQs
}) => {
  const [activeTab, setActiveTab] = useState('answer');

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'internal': return 'bg-green-100 text-green-800 border-green-200';
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'web': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'internal': return <FileText className="h-4 w-4" />;
      case 'academic': return <GraduationCap className="h-4 w-4" />;
      case 'web': return <ExternalLink className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'internal': return 'Internal Knowledge';
      case 'academic': return 'Academic Sources';
      case 'web': return 'Web Sources';
      default: return 'Knowledge Base';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>AI Assistant Response</span>
          </CardTitle>
          <Badge className={`${getTierBadgeColor(result.tier)} flex items-center space-x-1`}>
            {getTierIcon(result.tier)}
            <span>{getTierLabel(result.tier)}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="answer">Answer</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="answer" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <MarkdownRenderer 
                content={result.answer}
                className="text-gray-800 leading-relaxed"
              />
            </div>

            {/* Citations Section */}
            {result.citations && result.citations.length > 0 && (
              <div className="space-y-3">
                <Separator />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Sources & Citations</span>
                  </h4>
                  <div className="space-y-2">
                    {result.citations.map((citation, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">
                              {citation.source}
                            </h5>
                            {citation.snippet && (
                              <p className="text-xs text-gray-600 mb-2">
                                {citation.snippet}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {citation.type || 'Reference'} • Score: {Math.round(citation.score * 100)}%
                              </Badge>
                            </div>
                          </div>
                          {citation.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="ml-2"
                            >
                              <a 
                                href={citation.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span className="text-xs">View</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="flashcards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">Flashcards</h4>
              <Button variant="outline" size="sm" onClick={onDownloadFlashcards}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-600 text-sm">
                Flashcard generation will be available once you configure education settings and content processing.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="mcqs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">Multiple Choice Questions</h4>
              <Button variant="outline" size="sm" onClick={onDownloadMCQs}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-600 text-sm">
                MCQ generation will be available once you configure education settings and content processing.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QueryResultCard;
