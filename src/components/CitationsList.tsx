import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  domain?: string;
}

interface CitationsListProps {
  citations: Citation[];
}

const CitationsList: React.FC<CitationsListProps> = ({ citations }) => {
  const handleCitationClick = (citation: Citation) => {
    if (citation.url === '#knowledge-base') {
      toast({
        title: "Knowledge Base Reference",
        description: `This information comes from your uploaded file: ${citation.title}`,
      });
    } else {
      window.open(citation.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ExternalLink className="h-5 w-5" />
          <span>Sources & References ({citations.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {citations.map((citation, index) => (
            <div 
              key={citation.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleCitationClick(citation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="font-mono">[{index + 1}]</Badge>
                    <h4 className="font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                      <span>{citation.title}</span>
                      {citation.url !== '#knowledge-base' && (
                        <ExternalLink className="h-4 w-4" />
                      )}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {citation.snippet}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      Relevance: {(citation.relevance * 100).toFixed(0)}%
                    </Badge>
                    {citation.domain && (
                      <span className="text-xs text-blue-600 font-mono">
                        {citation.domain}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Citation Guide:</strong> Click any citation to visit the source. Numbers in brackets [1] correspond to these references. 
            Knowledge base sources are marked as internal references. All responses powered by OpenRouter AI.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CitationsList;