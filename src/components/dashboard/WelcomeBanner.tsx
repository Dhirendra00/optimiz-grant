import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  userName: string;
  profileCompletion: number;
  isIncomplete: boolean;
  onCompleteProfile: () => void;
}

const WelcomeBanner = ({ 
  userName, 
  profileCompletion, 
  isIncomplete, 
  onCompleteProfile 
}: WelcomeBannerProps) => {
  if (!isIncomplete) return null;

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome back, {userName}!
              </h2>
              <p className="text-muted-foreground">
                Your email has been verified. Complete your profile to unlock full access.
              </p>
            </div>
          </div>
          <Button onClick={onCompleteProfile} size="lg" className="shrink-0">
            Complete Organization Profile
          </Button>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-semibold text-primary">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete all sections to submit your profile for review
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
