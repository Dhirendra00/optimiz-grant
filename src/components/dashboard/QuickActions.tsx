import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Settings, 
  MessageCircle,
  ArrowRight
} from "lucide-react";

interface QuickActionsProps {
  isProfileComplete: boolean;
  onCompleteProfile: () => void;
}

const QuickActions = ({ isProfileComplete, onCompleteProfile }: QuickActionsProps) => {
  const actions = [
    {
      icon: Building2,
      label: "Complete Organization Profile",
      description: "Add details about your organization",
      primary: !isProfileComplete,
      onClick: onCompleteProfile,
      disabled: false,
    },
    {
      icon: FileText,
      label: "View Available Services",
      description: "Explore our grant consulting services",
      primary: false,
      href: "/services",
      disabled: false,
    },
    {
      icon: MessageCircle,
      label: "Contact Support",
      description: "Get help from our team",
      primary: false,
      href: "/contact",
      disabled: false,
    },
    {
      icon: Settings,
      label: "Account Settings",
      description: "Manage your account preferences",
      primary: false,
      disabled: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>What would you like to do today?</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          if (action.href && !action.disabled) {
            return (
              <Link key={index} to={action.href}>
                <Button 
                  variant={action.primary ? "default" : "outline"} 
                  className="w-full justify-between h-auto py-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs opacity-70">{action.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            );
          }
          
          return (
            <Button 
              key={index}
              variant={action.primary ? "default" : "outline"} 
              className="w-full justify-between h-auto py-3 px-4"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </div>
              {action.disabled ? (
                <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
