import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Quote, Upload, Globe } from "lucide-react";

interface Citation {
  source: string;
  score: number;
  snippet: string;
  url?: string;
  type?: 'custom' | 'web';
}

interface CitationDisplayProps {
  citations: Citation[];
}

const CitationDisplay: React.FC<CitationDisplayProps> = ({ citations }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'custom':
        return <Upload className="h-4 w-4 text-blue-600" />;
      case 'web':
        return <Globe className="h-4 w-4 text-green-600" />;
      default:
        return <ExternalLink className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'custom':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Custom Knowledge</Badge>;
      case 'web':
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Web Source</Badge>;
      default:
        return null;
    }
  };

  const handleCitationClick = (url?: string, source?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // If no URL provided, create a search link
      const searchQuery = encodeURIComponent(source || '');
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Group citations by type
  const customCitations = citations.filter(c => c.type === 'custom');
  const webCitations = citations.filter(c => c.type === 'web');
  const otherCitations = citations.filter(c => !c.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Quote className="h-5 w-5" />
          <span>Citations & References ({citations.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Custom Knowledge Citations */}
          {customCitations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>From Your Uploaded Documents ({customCitations.length})</span>
              </h3>
              <div className="space-y-3">
                {customCitations.map((citation, index) => (
                  <div key={`custom-${index}`} className="border rounded-lg p-4 space-y-3 hover:bg-blue-50 transition-colors border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(citation.type)}
                          <button 
                            onClick={() => handleCitationClick(citation.url, citation.source)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left transition-colors"
                          >
                            {citation.source}
                          </button>
                          {getTypeBadge(citation.type)}
                          {citation.url && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Direct Link
                            </Badge>
                          )}
                        </div>
                        <blockquote className="text-gray-700 italic border-l-4 border-blue-200 pl-4">
                          "{citation.snippet}"
                        </blockquote>
                        {citation.url && (
                          <div className="mt-2 text-xs text-gray-500 break-all">
                            🔗 {citation.url}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <Badge className={getScoreColor(citation.score)}>
                          {getScoreLabel(citation.score)} ({Math.round(citation.score * 100)}%)
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Relevance Score
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Web Sources Citations */}
          {webCitations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>From Web Sources ({webCitations.length})</span>
              </h3>
              <div className="space-y-3">
                {webCitations.map((citation, index) => (
                  <div key={`web-${index}`} className="border rounded-lg p-4 space-y-3 hover:bg-green-50 transition-colors border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(citation.type)}
                          <button 
                            onClick={() => handleCitationClick(citation.url, citation.source)}
                            className="text-green-600 hover:text-green-800 font-medium hover:underline text-left transition-colors"
                          >
                            {citation.source}
                          </button>
                          {getTypeBadge(citation.type)}
                          {citation.url && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Direct Link
                            </Badge>
                          )}
                        </div>
                        <blockquote className="text-gray-700 italic border-l-4 border-green-200 pl-4">
                          "{citation.snippet}"
                        </blockquote>
                        {citation.url && (
                          <div className="mt-2 text-xs text-gray-500 break-all">
                            🔗 {citation.url}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <Badge className={getScoreColor(citation.score)}>
                          {getScoreLabel(citation.score)} ({Math.round(citation.score * 100)}%)
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Relevance Score
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Citations (legacy) */}
          {otherCitations.length > 0 && (
            <div className="space-y-4">
              {otherCitations.map((citation, index) => (
                <div key={`other-${index}`} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                        <button 
                          onClick={() => handleCitationClick(citation.url, citation.source)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left transition-colors"
                        >
                          {citation.source}
                        </button>
                        {citation.url && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Direct Link
                          </Badge>
                        )}
                      </div>
                      <blockquote className="text-gray-700 italic border-l-4 border-gray-200 pl-4">
                        "{citation.snippet}"
                      </blockquote>
                      {citation.url && (
                        <div className="mt-2 text-xs text-gray-500 break-all">
                          🔗 {citation.url}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <Badge className={getScoreColor(citation.score)}>
                        {getScoreLabel(citation.score)} ({Math.round(citation.score * 100)}%)
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Relevance Score
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {citations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Quote className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No citations available</p>
              <p className="text-sm">Try uploading documents to the knowledge base for custom citations</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CitationDisplay;
