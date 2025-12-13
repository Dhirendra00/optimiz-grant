import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface ProfileSection {
  name: string;
  completed: boolean;
  weight: number;
}

interface ProfileCompletionWidgetProps {
  sections: ProfileSection[];
  totalCompletion: number;
}

const ProfileCompletionWidget = ({ sections, totalCompletion }: ProfileCompletionWidgetProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile Completion
          <span className="text-lg font-bold text-primary">{totalCompletion}%</span>
        </CardTitle>
        <CardDescription>Complete all sections to submit for review</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={totalCompletion} className="h-2" />
        
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-2 rounded-lg ${
                section.completed ? "bg-accent/10" : "bg-muted/50"
              }`}
            >
              {section.completed ? (
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={section.completed ? "text-foreground" : "text-muted-foreground"}>
                {section.name}
              </span>
              {section.completed && (
                <span className="ml-auto text-xs text-accent font-medium">
                  +{section.weight}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionWidget;
