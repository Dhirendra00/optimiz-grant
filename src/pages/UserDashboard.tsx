import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, Bell } from "lucide-react";
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
      // Fetch profile - use maybeSingle to handle missing profile gracefully
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      // Handle missing profile
      if (!profileData) {
        console.warn("Profile not found for user:", user.id);
        setProfile({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || null,
          phone: null,
          registration_status: "pending_verification",
          email_verified: false,
        });
      } else {
        setProfile(profileData);
      }

      // Fetch organization - use maybeSingle to handle missing org gracefully
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (orgError) {
        console.error("Error fetching organization:", orgError);
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

      // Show profile completion modal if profile is incomplete and organization exists
      if (profileData?.registration_status === "verified_incomplete" && orgData) {
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
        {/* Welcome Banner (30% profile complete) */}
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

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions Menu */}
          <div className="lg:col-span-2">
            <QuickActions 
              isProfileComplete={!isProfileIncomplete} 
              onCompleteProfile={() => setShowProfileModal(true)}
            />
          </div>

          {/* Right Column - Profile Completion Widget & Notifications Panel */}
          <div className="space-y-6">
            {/* Profile Completion Widget */}
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
                <CardDescription>Recent updates and alerts</CardDescription>
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
