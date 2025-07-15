import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { getAIResponse } from "@/services/openaiService";
import QueryForm from './QueryForm';
import QueryResponse from './QueryResponse';
import CitationsList from './CitationsList';

interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  domain?: string;
}

interface QueryResponseData {
  answer: string;
  citations: Citation[];
  confidence: number;
  processingTime: number;
}

const QueryInterface = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponseData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a question or search term",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse(null); // Reset previous response
    
    try {
      const startTime = Date.now();
      const { answer, citations } = await getAIResponse(query);
      
      // Validate citations
      const validCitations = citations.filter(cit => 
        cit.title && cit.url && cit.snippet && cit.relevance !== undefined
      );
      
      const enhancedCitations = validCitations.map((cit, index) => ({
        ...cit,
        id: `citation-${Date.now()}-${index}`,
        domain: cit.url ? new URL(cit.url).hostname.replace('www.', '') : 'unknown'
      }));

      const enhancedResponse: QueryResponseData = {
        answer,
        citations: enhancedCitations,
        confidence: 0.95,
        processingTime: Date.now() - startTime
      };
      
      setResponse(enhancedResponse);
      
      toast({
        title: "Query Processed",
        description: `Found ${enhancedCitations.length} relevant sources`,
      });
      
    } catch (error: unknown) {
      console.error('Query processing failed:', error);
      
      let errorMessage = "AI service is temporarily unavailable. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Query Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <QueryForm 
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {response && (
        <div className="space-y-4">
          <QueryResponse 
            answer={response.answer}
            confidence={response.confidence}
            processingTime={response.processingTime}
          />
          <CitationsList citations={response.citations} />
        </div>
      )}
    </div>
  );
};

export default QueryInterface;