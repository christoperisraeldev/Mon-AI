import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueryResponseProps {
  answer: string;
  confidence: number;
  processingTime: number;
}

const QueryResponse: React.FC<QueryResponseProps> = ({ answer, confidence, processingTime }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Response (Hugging Face)</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Confidence: {(confidence * 100).toFixed(0)}%
            </Badge>
            <Badge variant="outline">
              {processingTime}ms
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
            {answer}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryResponse;