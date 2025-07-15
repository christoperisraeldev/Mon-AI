
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, RotateCcw, Download, Eye, EyeOff } from "lucide-react";
import { EducationContent, FlashcardOutput, MCQOutput } from "@/types/education";

interface EducationDisplayProps {
  content: EducationContent;
}

const EducationDisplay: React.FC<EducationDisplayProps> = ({ content }) => {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number | null }>({});
  const [showMcqResults, setShowMcqResults] = useState<{ [key: string]: boolean }>({});

  const handleMcqAnswer = (mcqId: string, answerIndex: number) => {
    setMcqAnswers(prev => ({ ...prev, [mcqId]: answerIndex }));
    setShowMcqResults(prev => ({ ...prev, [mcqId]: true }));
  };

  const resetMcq = (mcqId: string) => {
    setMcqAnswers(prev => ({ ...prev, [mcqId]: null }));
    setShowMcqResults(prev => ({ ...prev, [mcqId]: false }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `education-content-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const FlashcardComponent = ({ flashcard }: { flashcard: FlashcardOutput }) => (
    <Card className="min-h-[300px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Flashcard {currentFlashcard + 1}</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline">{flashcard.difficulty}</Badge>
            <Badge variant="secondary">{flashcard.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Question</h3>
          <p className="text-lg">{flashcard.question}</p>
        </div>
        
        {showFlashcardAnswer && (
          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Answer</h3>
            <p className="text-lg text-green-700">{flashcard.answer}</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
            className="flex items-center space-x-2"
          >
            {showFlashcardAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showFlashcardAnswer ? 'Hide Answer' : 'Show Answer'}</span>
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentFlashcard(Math.max(0, currentFlashcard - 1));
              setShowFlashcardAnswer(false);
            }}
            disabled={currentFlashcard === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentFlashcard + 1} of {content.flashcards.length}
          </span>
          
          <Button
            variant="outline"
            onClick={() => {
              setCurrentFlashcard(Math.min(content.flashcards.length - 1, currentFlashcard + 1));
              setShowFlashcardAnswer(false);
            }}
            disabled={currentFlashcard === content.flashcards.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {flashcard.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MCQComponent = ({ mcq }: { mcq: MCQOutput }) => {
    const userAnswer = mcqAnswers[mcq.id];
    const showResult = showMcqResults[mcq.id];
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{mcq.question}</CardTitle>
            <div className="flex space-x-2">
              <Badge variant="outline">{mcq.difficulty}</Badge>
              <Badge variant="secondary">{mcq.category}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetMcq(mcq.id)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {mcq.options.map((option, index) => {
              let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline";
              
              if (showResult) {
                if (index === mcq.correctAnswer) {
                  buttonVariant = "default"; // Correct answer
                } else if (userAnswer === index) {
                  buttonVariant = "destructive"; // Wrong answer selected
                }
              }
              
              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => handleMcqAnswer(mcq.id, index)}
                  disabled={showResult}
                >
                  <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              );
            })}
          </div>
          
          {showResult && mcq.explanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700">{mcq.explanation}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {mcq.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Generated Education Content</CardTitle>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{content.flashcards.length}</div>
              <div className="text-sm text-muted-foreground">Flashcards</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{content.mcqs.length}</div>
              <div className="text-sm text-muted-foreground">MCQs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{content.metadata.difficulty}</div>
              <div className="text-sm text-muted-foreground">Difficulty</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{content.metadata.sourceLength}</div>
              <div className="text-sm text-muted-foreground">Source Length</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">{content.metadata.processingTime}ms</div>
              <div className="text-sm text-muted-foreground">Generated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="flashcards">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcards">Flashcards ({content.flashcards.length})</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs ({content.mcqs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-4">
          {content.flashcards.length > 0 ? (
            <FlashcardComponent flashcard={content.flashcards[currentFlashcard]} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No flashcards generated</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mcqs" className="space-y-4">
          {content.mcqs.length > 0 ? (
            content.mcqs.map((mcq) => (
              <MCQComponent key={mcq.id} mcq={mcq} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No MCQs generated</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationDisplay;
