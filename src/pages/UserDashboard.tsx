import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Building2, FileText, CheckCircle2, Loader2, AlertCircle, Bell } from "lucide-react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import ProfileCompletionWidget from "@/components/dashboard/ProfileCompletionWidget";
import ProfileCompletionForm from "@/components/dashboard/ProfileCompletionForm";

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
  registration_number: string | null;
  annual_budget_range: string | null;
  staff_count: string | null;
  has_grant_experience: boolean | null;
  grant_experience_details: string | null;
  current_funders: string | null;
  preferred_communication: string | null;
  consulting_interest: boolean | null;
  geographic_focus: string | null;
  profile_submitted: boolean | null;
  profile_submitted_at: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority_level: string;
  publish_date: string;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
      }

      // Fetch announcements for organization users
      const { data: announcementData } = await supabase
        .from("announcements")
        .select("*")
        .order("publish_date", { ascending: false })
        .limit(3);

      if (announcementData) {
        setAnnouncements(announcementData);
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

  const calculateProfileSections = () => {
    if (!organization) {
      return {
        sections: [
          { name: "Account Created", completed: true, weight: 20 },
          { name: "Email Verified", completed: profile?.email_verified || false, weight: 10 },
          { name: "Organization Details", completed: false, weight: 15 },
          { name: "Mission & Activities", completed: false, weight: 20 },
          { name: "Organizational Capacity", completed: false, weight: 15 },
          { name: "Documents Uploaded", completed: false, weight: 10 },
          { name: "Preferences Set", completed: false, weight: 10 },
        ],
        total: 30,
      };
    }

    const sections = [
      { 
        name: "Account Created", 
        completed: true, 
        weight: 20 
      },
      { 
        name: "Email Verified", 
        completed: profile?.email_verified || false, 
        weight: 10 
      },
      { 
        name: "Organization Details", 
        completed: !!organization.registration_number || !!organization.year_established, 
        weight: 15 
      },
      { 
        name: "Mission & Activities", 
        completed: !!organization.mission && !!organization.activities, 
        weight: 20 
      },
      { 
        name: "Organizational Capacity", 
        completed: !!organization.annual_budget_range || !!organization.staff_count, 
        weight: 15 
      },
      { 
        name: "Documents Uploaded", 
        completed: false, // Will be updated when we check documents
        weight: 10 
      },
      { 
        name: "Preferences Set", 
        completed: !!organization.preferred_communication, 
        weight: 10 
      },
    ];

    const total = sections.reduce((acc, s) => acc + (s.completed ? s.weight : 0), 0);
    return { sections, total };
  };

  const { sections: profileSections, total: profileCompletion } = calculateProfileSections();
  const isProfileIncomplete = profile?.registration_status === "verified_incomplete";
  const isProfileSubmitted = profile?.registration_status === "profile_submitted";

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
        {/* Welcome Banner for incomplete profiles */}
        <WelcomeBanner
          userName={profile?.full_name?.split(" ")[0] || "there"}
          profileCompletion={profileCompletion}
          isIncomplete={isProfileIncomplete}
          onCompleteProfile={() => setShowProfileModal(true)}
        />

        {/* Profile Submitted Banner */}
        {isProfileSubmitted && (
          <Card className="mb-8 border-accent/20 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent mt-0.5" />
                <div>
                  <h2 className="text-xl font-semibold">Profile Submitted Successfully!</h2>
                  <p className="text-muted-foreground">
                    Our team will review your profile within 24-48 hours. You'll receive a notification once verified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>

        {/* Status Cards */}
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
                    <span className="text-lg font-bold">Verified</span>
                  </>
                ) : isProfileSubmitted ? (
                  <>
                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                    <span className="text-lg font-bold">Under Review</span>
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Profile Completion */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions 
              isProfileComplete={!isProfileIncomplete} 
              onCompleteProfile={() => setShowProfileModal(true)}
            />
            
            {/* Organization Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Your registered organization information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Organization Name</Label>
                    <p className="font-medium">{organization?.name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p>{organization?.organization_type || "-"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Address</Label>
                  <p>
                    {[organization?.address, organization?.city, organization?.state, organization?.postal_code, organization?.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Website</Label>
                    <p>{organization?.website || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Year Established</Label>
                    <p>{organization?.year_established || "-"}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => setShowProfileModal(true)}
                >
                  Edit Organization Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Completion Widget & Notifications */}
          <div className="space-y-6">
            <ProfileCompletionWidget 
              sections={profileSections}
              totalCompletion={profileCompletion}
            />
            
            {/* Notifications Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div 
                        key={announcement.id} 
                        className={`p-3 rounded-lg border ${
                          announcement.priority_level === 'high' 
                            ? 'bg-destructive/5 border-destructive/20' 
                            : 'bg-muted/50'
                        }`}
                      >
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No new notifications
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Profile Completion Form Modal */}
      {user && organization && (
        <ProfileCompletionForm
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
          userId={user.id}
          organization={organization}
          onProfileUpdated={fetchUserData}
        />
      )}
    </div>
  );
};

export default UserDashboard;
