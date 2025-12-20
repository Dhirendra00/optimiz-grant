import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, Check, X, MessageSquare, Loader2, Building2, FileText, Download } from "lucide-react";
import { format } from "date-fns";

interface PendingProfile {
  id: string;
  name: string;
  organization_type: string | null;
  registration_number: string | null;
  year_established: number | null;
  website: string | null;
  mission: string | null;
  activities: string | null;
  target_population: string | null;
  geographic_focus: string | null;
  annual_budget_range: string | null;
  staff_count: string | null;
  has_grant_experience: boolean | null;
  grant_experience_details: string | null;
  current_funders: string | null;
  current_challenges: string | null;
  preferred_communication: string | null;
  consulting_interest: boolean | null;
  profile_submitted_at: string | null;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

interface OrganizationDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

export default function ProfileReviewQueue() {
  const { userRole } = useAuth();
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(null);
  const [documents, setDocuments] = useState<OrganizationDocument[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [requestChangesDialogOpen, setRequestChangesDialogOpen] = useState(false);
  const [changesMessage, setChangesMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (userRole === "admin") {
      fetchPendingProfiles();
    }
  }, [userRole]);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      // Fetch organizations with profile_submitted = true
      const { data: orgs, error: orgsError } = await supabase
        .from("organizations")
        .select("*")
        .eq("profile_submitted", true)
        .order("profile_submitted_at", { ascending: false });

      if (orgsError) throw orgsError;

      if (!orgs || orgs.length === 0) {
        setPendingProfiles([]);
        setLoading(false);
        return;
      }

      // Get user IDs to fetch their profiles
      const userIds = orgs.map(org => org.user_id);

      // Fetch profiles for these users to check status
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, registration_status")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Filter to only show pending profiles (profile_submitted status)
      const pendingUserIds = profiles
        ?.filter(p => p.registration_status === "profile_submitted")
        .map(p => p.id) || [];

      const pendingOrgs = orgs
        .filter(org => pendingUserIds.includes(org.user_id))
        .map(org => {
          const userProfile = profiles?.find(p => p.id === org.user_id);
          return {
            ...org,
            user_email: userProfile?.email,
            user_name: userProfile?.full_name,
          };
        });

      setPendingProfiles(pendingOrgs);
    } catch (error: any) {
      toast.error("Failed to fetch pending profiles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (organizationId: string) => {
    const { data, error } = await supabase
      .from("organization_documents")
      .select("*")
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Failed to fetch documents:", error);
      return;
    }

    setDocuments(data || []);
  };

  const handleViewProfile = async (profile: PendingProfile) => {
    setSelectedProfile(profile);
    await fetchDocuments(profile.id);
    setReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedProfile) return;

    setProcessing(true);
    try {
      // Update profile status to verified
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ registration_status: "verified" })
        .eq("id", selectedProfile.user_id);

      if (profileError) throw profileError;

      toast.success("Profile approved successfully");
      setReviewDialogOpen(false);
      fetchPendingProfiles();
    } catch (error: any) {
      toast.error("Failed to approve profile: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!selectedProfile || !changesMessage.trim()) return;

    setProcessing(true);
    try {
      // Update profile status back to verified_incomplete
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ registration_status: "verified_incomplete" })
        .eq("id", selectedProfile.user_id);

      if (profileError) throw profileError;

      // Reset profile_submitted flag
      const { error: orgError } = await supabase
        .from("organizations")
        .update({ 
          profile_submitted: false,
          profile_submitted_at: null 
        })
        .eq("id", selectedProfile.id);

      if (orgError) throw orgError;

      // TODO: Send email to user with changes message

      toast.success("Changes requested. The user has been notified.");
      setRequestChangesDialogOpen(false);
      setReviewDialogOpen(false);
      setChangesMessage("");
      fetchPendingProfiles();
    } catch (error: any) {
      toast.error("Failed to request changes: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProfile) return;

    setProcessing(true);
    try {
      // Update profile status to rejected
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ registration_status: "rejected" })
        .eq("id", selectedProfile.user_id);

      if (profileError) throw profileError;

      toast.success("Profile rejected");
      setReviewDialogOpen(false);
      fetchPendingProfiles();
    } catch (error: any) {
      toast.error("Failed to reject profile: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadDocument = async (doc: OrganizationDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("organization-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download document: " + error.message);
    }
  };

  if (userRole !== "admin") {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Review Queue</h1>
          <p className="text-muted-foreground">Review and verify organization profiles</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pendingProfiles.length} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Pending Organization Profiles
          </CardTitle>
          <CardDescription>
            Organizations awaiting profile verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pendingProfiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending profiles to review</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        {profile.name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{profile.user_name || "N/A"}</p>
                          <p className="text-muted-foreground">{profile.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {profile.organization_type || "Not specified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {profile.profile_submitted_at 
                          ? format(new Date(profile.profile_submitted_at), "MMM dd, yyyy")
                          : "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewProfile(profile)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Organization Profile</DialogTitle>
            <DialogDescription>
              {selectedProfile?.name} - Submitted by {selectedProfile?.user_email}
            </DialogDescription>
          </DialogHeader>

          {selectedProfile && (
            <div className="space-y-6">
              {/* Organization Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground text-xs">Organization Name</Label>
                  <p className="font-medium">{selectedProfile.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Type</Label>
                  <p>{selectedProfile.organization_type || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Registration Number</Label>
                  <p>{selectedProfile.registration_number || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Year Established</Label>
                  <p>{selectedProfile.year_established || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Website</Label>
                  <p>{selectedProfile.website || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Geographic Focus</Label>
                  <p>{selectedProfile.geographic_focus || "-"}</p>
                </div>
              </div>

              {/* Mission & Activities */}
              <div className="space-y-3">
                <h3 className="font-semibold">Mission & Activities</h3>
                <div className="p-4 border rounded-lg space-y-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Mission Statement</Label>
                    <p className="text-sm">{selectedProfile.mission || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Core Activities</Label>
                    <p className="text-sm">{selectedProfile.activities || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Target Population</Label>
                    <p className="text-sm">{selectedProfile.target_population || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Organizational Capacity */}
              <div className="space-y-3">
                <h3 className="font-semibold">Organizational Capacity</h3>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label className="text-muted-foreground text-xs">Annual Budget Range</Label>
                    <p className="text-sm">{selectedProfile.annual_budget_range || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Staff/Volunteers</Label>
                    <p className="text-sm">{selectedProfile.staff_count || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Grant Experience</Label>
                    <p className="text-sm">{selectedProfile.has_grant_experience ? "Yes" : "No"}</p>
                    {selectedProfile.grant_experience_details && (
                      <p className="text-xs text-muted-foreground mt-1">{selectedProfile.grant_experience_details}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Current Funders</Label>
                    <p className="text-sm">{selectedProfile.current_funders || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Documents
                </h3>
                {documents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.document_type} • {(doc.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4 border rounded-lg">
                    No documents uploaded
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setRequestChangesDialogOpen(true)}
                  disabled={processing}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Request Changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <X className="h-4 w-4 mr-1" />}
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={requestChangesDialogOpen} onOpenChange={setRequestChangesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Describe what changes are needed. The user will be notified and their profile will be marked as incomplete.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="changes">Required Changes</Label>
              <Textarea
                id="changes"
                rows={4}
                placeholder="Please describe what information needs to be updated or corrected..."
                value={changesMessage}
                onChange={(e) => setChangesMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setRequestChangesDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestChanges}
                disabled={!changesMessage.trim() || processing}
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
