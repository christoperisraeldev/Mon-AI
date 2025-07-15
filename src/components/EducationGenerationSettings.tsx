import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

interface EducationGenerationSettingsProps {
  flashcardCount: number;
  mcqCount: number;
  autoGenerate: boolean;
  onFlashcardCountChange: (count: number) => void;
  onMcqCountChange: (count: number) => void;
  onAutoGenerateChange: (autoGenerate: boolean) => void;
}

const EducationGenerationSettings: React.FC<EducationGenerationSettingsProps> = ({
  flashcardCount,
  mcqCount,
  autoGenerate,
  onFlashcardCountChange,
  onMcqCountChange,
  onAutoGenerateChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Smart Generation Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="flashcard-count">Flashcards</Label>
            <Input
              id="flashcard-count"
              type="number"
              min="1"
              max="20"
              value={flashcardCount}
              onChange={(e) => onFlashcardCountChange(parseInt(e.target.value) || 5)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="mcq-count">MCQs</Label>
            <Input
              id="mcq-count"
              type="number"
              min="1"
              max="15"
              value={mcqCount}
              onChange={(e) => onMcqCountChange(parseInt(e.target.value) || 3)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="auto-generate">Auto-Generate</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="auto-generate"
                checked={autoGenerate}
                onCheckedChange={onAutoGenerateChange}
              />
              <span className="text-sm text-muted-foreground">
                Generate automatically when content is added
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationGenerationSettings;
