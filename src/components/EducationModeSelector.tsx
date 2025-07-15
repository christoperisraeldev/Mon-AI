
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BloomTaxonomy } from "@/types/education";
import { BookOpen, Target, Lightbulb } from "lucide-react";

interface EducationModeSelectorProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thinkingLevel: BloomTaxonomy;
  onDifficultyChange: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  onThinkingLevelChange: (level: BloomTaxonomy) => void;
}

const EducationModeSelector: React.FC<EducationModeSelectorProps> = ({
  difficulty,
  thinkingLevel,
  onDifficultyChange,
  onThinkingLevelChange
}) => {
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Simple explanations and basic concepts', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity with examples', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', description: 'Complex analysis and detailed explanations', color: 'bg-red-100 text-red-800' }
  ];

  const bloomOptions = [
    { value: 'remember', label: 'Remember', description: 'Recall facts and basic concepts', icon: '📝' },
    { value: 'understand', label: 'Understand', description: 'Explain ideas or concepts', icon: '💡' },
    { value: 'apply', label: 'Apply', description: 'Use information in new situations', icon: '🔧' },
    { value: 'analyze', label: 'Analyze', description: 'Draw connections among ideas', icon: '🔍' },
    { value: 'evaluate', label: 'Evaluate', description: 'Justify a position or decision', icon: '⚖️' },
    { value: 'create', label: 'Create', description: 'Produce new or original work', icon: '🎨' }
  ];

  const getCurrentDifficultyInfo = () => {
    return difficultyOptions.find(option => option.value === difficulty);
  };

  const getCurrentBloomInfo = () => {
    return bloomOptions.find(option => option.value === thinkingLevel);
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Education Mode Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getCurrentDifficultyInfo() && (
              <Badge className={`mt-2 ${getCurrentDifficultyInfo()?.color}`}>
                {getCurrentDifficultyInfo()?.label}
              </Badge>
            )}
          </div>

          <div>
            <Label htmlFor="thinking-level">Thinking Level (Bloom's Taxonomy)</Label>
            <Select value={thinkingLevel} onValueChange={(value) => onThinkingLevelChange(value as BloomTaxonomy)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bloomOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getCurrentBloomInfo() && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-lg">{getCurrentBloomInfo()?.icon}</span>
                <Badge variant="outline">
                  {getCurrentBloomInfo()?.label}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-sm">Current Settings Impact</span>
          </div>
          <p className="text-sm text-gray-600">
            Your flashcards and MCQs will be generated at <strong>{difficulty}</strong> difficulty level, 
            focusing on <strong>{getCurrentBloomInfo()?.label.toLowerCase()}</strong> cognitive skills: {getCurrentBloomInfo()?.description.toLowerCase()}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationModeSelector;
