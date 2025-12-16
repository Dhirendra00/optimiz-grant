import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  organizationName: z.string().trim().min(2, "Organization name must be at least 2 characters").max(200, "Organization name must be less than 200 characters"),
  organizationType: z.string().min(1, "Please select an organization type"),
});

const ORGANIZATION_TYPES = [
  "Non-Profit Organization",
  "Charity",
  "Community Organization",
  "Social Enterprise",
  "Educational Institution",
  "Healthcare Organization",
  "Environmental Organization",
  "Arts & Culture Organization",
  "Other",
];

interface InitialProfileSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onProfileCreated: () => void;
}

const InitialProfileSetup = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  onProfileCreated,
}: InitialProfileSetupProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    organizationName: "",
    organizationType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      // Create profile record
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          email: userEmail,
          full_name: formData.fullName.trim(),
          email_verified: true,
          registration_status: "verified_incomplete",
        });

      if (profileError) throw profileError;

      // Create organization record
      const { error: orgError } = await supabase
        .from("organizations")
        .insert({
          user_id: userId,
          name: formData.organizationName.trim(),
          organization_type: formData.organizationType,
        });

      if (orgError) throw orgError;

      toast({
        title: "Profile Created",
        description: "Your profile has been set up. Now complete your organization details.",
      });

      onProfileCreated();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error creating profile:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Welcome to OptimizGrant!</DialogTitle>
              <DialogDescription>
                Let's set up your profile to get started
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Your Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name *</Label>
            <Input
              id="organizationName"
              placeholder="Enter your organization's name"
              value={formData.organizationName}
              onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
              className={errors.organizationName ? "border-destructive" : ""}
            />
            {errors.organizationName && (
              <p className="text-xs text-destructive">{errors.organizationName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Organization Type *</Label>
            <Select
              value={formData.organizationType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationType: value }))}
            >
              <SelectTrigger className={errors.organizationType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organizationType && (
              <p className="text-xs text-destructive">{errors.organizationType}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Continue to Profile Setup"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialProfileSetup;
