import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen, MessageSquare } from "lucide-react";

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const QueryForm: React.FC<QueryFormProps> = ({ query, setQuery, onSubmit, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Ask any medical or health question... I'll provide comprehensive answers."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                Evidence-Based
              </Badge>
              <Badge variant="outline" className="text-xs">
                Citation-Ready
              </Badge>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Ask AI
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QueryForm;