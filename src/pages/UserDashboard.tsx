import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Building2, FileText, CheckCircle2, Loader2, AlertCircle, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  registration_status: string | null;
  email_verified: boolean | null;
}

interface Organization {
  id: string;
  name: string;
  organization_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  website: string | null;
  year_established: number | null;
  mission: string | null;
  activities: string | null;
  achievements: string | null;
  target_population: string | null;
  current_challenges: string | null;
  services_required: string[] | null;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile completion form state
  const [formData, setFormData] = useState({
    year_established: "",
    mission: "",
    activities: "",
    achievements: "",
    target_population: "",
    current_challenges: "",
    website: "",
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch organization
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (orgError && orgError.code !== "PGRST116") {
        throw orgError;
      }

      if (orgData) {
        setOrganization(orgData);
        setFormData({
          year_established: orgData.year_established?.toString() || "",
          mission: orgData.mission || "",
          activities: orgData.activities || "",
          achievements: orgData.achievements || "",
          target_population: orgData.target_population || "",
          current_challenges: orgData.current_challenges || "",
          website: orgData.website || "",
        });
      }

      // Show profile completion modal if profile is incomplete
      if (profileData?.registration_status === "verified_incomplete") {
        setShowProfileModal(true);
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!organization) return 30;

    let completed = 30; // Base for account creation
    if (organization.year_established) completed += 10;
    if (organization.mission) completed += 15;
    if (organization.activities) completed += 15;
    if (organization.achievements) completed += 10;
    if (organization.target_population) completed += 10;
    if (organization.current_challenges) completed += 10;

    return Math.min(completed, 100);
  };

  const handleSaveProfile = async () => {
    if (!user || !organization) return;

    setSaving(true);
    try {
      const { error: orgError } = await supabase
        .from("organizations")
        .update({
          year_established: formData.year_established ? parseInt(formData.year_established) : null,
          mission: formData.mission || null,
          activities: formData.activities || null,
          achievements: formData.achievements || null,
          target_population: formData.target_population || null,
          current_challenges: formData.current_challenges || null,
          website: formData.website || null,
        })
        .eq("id", organization.id);

      if (orgError) throw orgError;

      // Update profile status to active if all required fields are filled
      const isComplete = formData.mission && formData.activities;
      if (isComplete) {
        await supabase
          .from("profiles")
          .update({ registration_status: "active" })
          .eq("id", user.id);

        setProfile(prev => prev ? { ...prev, registration_status: "active" } : prev);
      }

      // Refresh organization data
      const { data: updatedOrg } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", organization.id)
        .single();

      if (updatedOrg) {
        setOrganization(updatedOrg);
      }

      toast({
        title: "Profile Updated",
        description: "Your organization profile has been saved successfully",
      });

      setShowProfileModal(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const profileCompletion = calculateProfileCompletion();
  const isProfileIncomplete = profile?.registration_status === "verified_incomplete";

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        {isProfileIncomplete && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Welcome to OptimizGrant, {profile?.full_name?.split(" ")[0] || "there"}!
                    </h2>
                    <p className="text-muted-foreground">
                      Complete your organization profile to get started with our services
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowProfileModal(true)}>
                  Complete Profile
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {profile?.registration_status === "active" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="text-lg font-bold">Complete</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-lg font-bold">Incomplete</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{profileCompletion}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organization</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{organization?.name || "Not set"}</div>
              <p className="text-xs text-muted-foreground">{organization?.organization_type || "Organization type not set"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Requested</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organization?.services_required?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active service interests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Your registered organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">Organization Name</Label>
                <p className="font-medium">{organization?.name || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Type</Label>
                <p>{organization?.organization_type || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Address</Label>
                <p>
                  {[organization?.address, organization?.city, organization?.state, organization?.postal_code, organization?.country]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Website</Label>
                <p>{organization?.website || "-"}</p>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowProfileModal(true)}>
                Edit Organization Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline" onClick={() => setShowProfileModal(true)}>
                Complete Organization Profile
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Request Grant Consultation
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Upload Documents
              </Button>
              <Button className="w-full" variant="outline" disabled>
                View Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Profile Completion Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Organization Profile</DialogTitle>
            <DialogDescription>
              Provide additional details to help us serve you better
            </DialogDescription>
          </DialogHeader>

          <Accordion type="single" collapsible defaultValue="section-1" className="w-full">
            <AccordionItem value="section-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span>Organization Details</span>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Organization</Label>
                    <p className="font-medium">{organization?.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p>{organization?.organization_type}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Address</Label>
                  <p>
                    {[organization?.address, organization?.city, organization?.state, organization?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-2">
              <AccordionTrigger>Organization Profile</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input
                      id="year_established"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.year_established}
                      onChange={e => setFormData(prev => ({ ...prev, year_established: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://"
                      value={formData.website}
                      onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement *</Label>
                  <Textarea
                    id="mission"
                    rows={3}
                    placeholder="Describe your organization's mission..."
                    value={formData.mission}
                    onChange={e => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activities">Core Activities/Services *</Label>
                  <Textarea
                    id="activities"
                    rows={3}
                    placeholder="List your main activities and services..."
                    value={formData.activities}
                    onChange={e => setFormData(prev => ({ ...prev, activities: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea
                    id="achievements"
                    rows={3}
                    placeholder="Highlight your organization's key achievements..."
                    value={formData.achievements}
                    onChange={e => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_population">Target Population Served</Label>
                  <Textarea
                    id="target_population"
                    rows={2}
                    placeholder="Who does your organization serve?"
                    value={formData.target_population}
                    onChange={e => setFormData(prev => ({ ...prev, target_population: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_challenges">Current Challenges</Label>
                  <Textarea
                    id="current_challenges"
                    rows={2}
                    placeholder="What challenges is your organization facing?"
                    value={formData.current_challenges}
                    onChange={e => setFormData(prev => ({ ...prev, current_challenges: e.target.value }))}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-3">
              <AccordionTrigger>Supporting Documents (Coming Soon)</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Document upload functionality will be available soon
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You'll be able to upload registration certificates, annual reports, and previous grant documents
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowProfileModal(false)}>
              Save & Close Later
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;