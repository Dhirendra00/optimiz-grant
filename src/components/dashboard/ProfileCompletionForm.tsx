import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import DocumentUpload from "./DocumentUpload";
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
import { Switch } from "@/components/ui/switch";

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
}

interface UploadedDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

interface ProfileCompletionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  organization: Organization | null;
  onProfileUpdated: () => void;
}

const BUDGET_RANGES = [
  "Under $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "Over $1,000,000",
];

const STAFF_COUNTS = [
  "1-5 (including volunteers)",
  "6-10",
  "11-25",
  "26-50",
  "51-100",
  "100+",
];

const COMMUNICATION_METHODS = [
  "Email",
  "Phone",
  "Video Call",
  "In-Person Meeting",
];

const ProfileCompletionForm = ({
  open,
  onOpenChange,
  userId,
  organization,
  onProfileUpdated,
}: ProfileCompletionFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    orgDetails: true,
    mission: true,
    capacity: false,
    documents: false,
    preferences: false,
  });

  const [formData, setFormData] = useState({
    registration_number: "",
    year_established: "",
    website: "",
    mission: "",
    activities: "",
    target_population: "",
    geographic_focus: "",
    annual_budget_range: "",
    staff_count: "",
    has_grant_experience: false,
    grant_experience_details: "",
    current_funders: "",
    achievements: "",
    current_challenges: "",
    preferred_communication: "",
    consulting_interest: false,
  });

  // Initialize form data from organization
  useEffect(() => {
    if (organization) {
      setFormData({
        registration_number: organization.registration_number || "",
        year_established: organization.year_established?.toString() || "",
        website: organization.website || "",
        mission: organization.mission || "",
        activities: organization.activities || "",
        target_population: organization.target_population || "",
        geographic_focus: organization.geographic_focus || "",
        annual_budget_range: organization.annual_budget_range || "",
        staff_count: organization.staff_count || "",
        has_grant_experience: organization.has_grant_experience || false,
        grant_experience_details: organization.grant_experience_details || "",
        current_funders: organization.current_funders || "",
        achievements: organization.achievements || "",
        current_challenges: organization.current_challenges || "",
        preferred_communication: organization.preferred_communication || "",
        consulting_interest: organization.consulting_interest || false,
      });
      fetchDocuments();
    }
  }, [organization]);

  const fetchDocuments = async () => {
    if (!organization) return;
    
    const { data } = await supabase
      .from("organization_documents")
      .select("*")
      .eq("organization_id", organization.id);
    
    if (data) setDocuments(data);
  };

  // Auto-save every 30 seconds
  const autoSave = useCallback(async () => {
    if (!organization || saving) return;
    
    setAutoSaving(true);
    try {
      await supabase
        .from("organizations")
        .update({
          registration_number: formData.registration_number || null,
          year_established: formData.year_established ? parseInt(formData.year_established) : null,
          website: formData.website || null,
          mission: formData.mission || null,
          activities: formData.activities || null,
          target_population: formData.target_population || null,
          geographic_focus: formData.geographic_focus || null,
          annual_budget_range: formData.annual_budget_range || null,
          staff_count: formData.staff_count || null,
          has_grant_experience: formData.has_grant_experience,
          grant_experience_details: formData.grant_experience_details || null,
          current_funders: formData.current_funders || null,
          achievements: formData.achievements || null,
          current_challenges: formData.current_challenges || null,
          preferred_communication: formData.preferred_communication || null,
          consulting_interest: formData.consulting_interest,
        })
        .eq("id", organization.id);
      
      setLastSaved(new Date());
    } catch (err) {
      console.error("Auto-save error:", err);
    } finally {
      setAutoSaving(false);
    }
  }, [organization, formData, saving]);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [open, autoSave]);

  const handleSave = async (submit = false) => {
    if (!organization) return;

    setSaving(true);
    try {
      const updateData: any = {
        registration_number: formData.registration_number || null,
        year_established: formData.year_established ? parseInt(formData.year_established) : null,
        website: formData.website || null,
        mission: formData.mission || null,
        activities: formData.activities || null,
        target_population: formData.target_population || null,
        geographic_focus: formData.geographic_focus || null,
        annual_budget_range: formData.annual_budget_range || null,
        staff_count: formData.staff_count || null,
        has_grant_experience: formData.has_grant_experience,
        grant_experience_details: formData.grant_experience_details || null,
        current_funders: formData.current_funders || null,
        achievements: formData.achievements || null,
        current_challenges: formData.current_challenges || null,
        preferred_communication: formData.preferred_communication || null,
        consulting_interest: formData.consulting_interest,
      };

      if (submit) {
        updateData.profile_submitted = true;
        updateData.profile_submitted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", organization.id);

      if (error) throw error;

      if (submit) {
        // Update profile status
        await supabase
          .from("profiles")
          .update({ registration_status: "profile_submitted" })
          .eq("id", userId);

        // Get user profile for notification
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .single();

        // Notify admins about profile submission
        try {
          await supabase.functions.invoke("notify-admin-profile-submitted", {
            body: {
              organizationId: organization.id,
              organizationName: organization.name,
              userEmail: userProfile?.email || "",
              userName: userProfile?.full_name || "",
            },
          });
        } catch (notifyError) {
          console.error("Failed to send admin notification:", notifyError);
          // Don't fail the submission if notification fails
        }

        toast({
          title: "Profile Submitted Successfully!",
          description: "Our team will review your profile within 24-48 hours. You'll receive a notification once verified.",
        });
      } else {
        toast({
          title: "Profile Saved",
          description: "Your changes have been saved",
        });
      }

      onProfileUpdated();
      if (submit) onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ 
    id, 
    title, 
    completed = false 
  }: { 
    id: keyof typeof expandedSections; 
    title: string; 
    completed?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-2">
        {completed && <CheckCircle2 className="h-5 w-5 text-accent" />}
        <span className="font-medium">{title}</span>
      </div>
      {expandedSections[id] ? (
        <ChevronUp className="h-5 w-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );

  const getDocumentByType = (type: string) => 
    documents.find(d => d.document_type === type) || null;

  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Organization Profile</DialogTitle>
          <DialogDescription>
            Fill in the details below to complete your profile and submit for review
            {lastSaved && (
              <span className="ml-2 text-xs text-muted-foreground">
                {autoSaving ? "Saving..." : `Last saved: ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Section A: Organization Details */}
          <div className="space-y-3">
            <SectionHeader 
              id="orgDetails" 
              title="Section A: Organization Details" 
              completed={!!organization.name}
            />
            {expandedSections.orgDetails && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Organization Name</Label>
                    <p className="font-medium">{organization.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p>{organization.organization_type || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number (ABN)</Label>
                    <Input
                      id="registration_number"
                      placeholder="e.g., 12 345 678 901"
                      value={formData.registration_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_number: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input
                      id="year_established"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.year_established}
                      onChange={(e) => setFormData(prev => ({ ...prev, year_established: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.yourorganization.org"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section B: Mission & Activities */}
          <div className="space-y-3">
            <SectionHeader 
              id="mission" 
              title="Section B: Mission & Activities" 
              completed={!!formData.mission && !!formData.activities}
            />
            {expandedSections.mission && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement *</Label>
                  <Textarea
                    id="mission"
                    rows={4}
                    placeholder="Describe your organization's mission and purpose..."
                    value={formData.mission}
                    onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activities">Core Activities/Services *</Label>
                  <Textarea
                    id="activities"
                    rows={3}
                    placeholder="List your main activities, programs, and services..."
                    value={formData.activities}
                    onChange={(e) => setFormData(prev => ({ ...prev, activities: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_population">Target Population Served</Label>
                  <Textarea
                    id="target_population"
                    rows={2}
                    placeholder="Who does your organization primarily serve?"
                    value={formData.target_population}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_population: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="geographic_focus">Geographic Focus Areas</Label>
                  <Input
                    id="geographic_focus"
                    placeholder="e.g., Sydney Metro, Regional NSW, Australia-wide"
                    value={formData.geographic_focus}
                    onChange={(e) => setFormData(prev => ({ ...prev, geographic_focus: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section C: Organizational Capacity */}
          <div className="space-y-3">
            <SectionHeader 
              id="capacity" 
              title="Section C: Organizational Capacity" 
              completed={!!formData.annual_budget_range || !!formData.staff_count}
            />
            {expandedSections.capacity && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Annual Budget Range</Label>
                    <Select
                      value={formData.annual_budget_range}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, annual_budget_range: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Staff/Volunteers</Label>
                    <Select
                      value={formData.staff_count}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, staff_count: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAFF_COUNTS.map((count) => (
                          <SelectItem key={count} value={count}>{count}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Previous Grant Experience</Label>
                    <p className="text-sm text-muted-foreground">
                      Has your organization received grants before?
                    </p>
                  </div>
                  <Switch
                    checked={formData.has_grant_experience}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_grant_experience: checked }))}
                  />
                </div>
                
                {formData.has_grant_experience && (
                  <div className="space-y-2">
                    <Label htmlFor="grant_experience_details">Grant Experience Details</Label>
                    <Textarea
                      id="grant_experience_details"
                      rows={2}
                      placeholder="Briefly describe your previous grant experience..."
                      value={formData.grant_experience_details}
                      onChange={(e) => setFormData(prev => ({ ...prev, grant_experience_details: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="current_funders">Current Major Funders</Label>
                  <Textarea
                    id="current_funders"
                    rows={2}
                    placeholder="List any current funders or funding sources..."
                    value={formData.current_funders}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_funders: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea
                    id="achievements"
                    rows={3}
                    placeholder="Highlight your organization's key achievements..."
                    value={formData.achievements}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section D: Documents Upload */}
          <div className="space-y-3">
            <SectionHeader 
              id="documents" 
              title="Section D: Documents Upload" 
              completed={documents.length > 0}
            />
            {expandedSections.documents && (
              <div className="p-4 border rounded-lg space-y-4">
                <DocumentUpload
                  userId={userId}
                  organizationId={organization.id}
                  documentType="registration_certificate"
                  label="Registration Certificate"
                  required
                  existingDocument={getDocumentByType("registration_certificate")}
                  onUploadComplete={(doc) => setDocuments(prev => [...prev.filter(d => d.document_type !== doc.document_type), doc])}
                  onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                />
                <DocumentUpload
                  userId={userId}
                  organizationId={organization.id}
                  documentType="annual_report"
                  label="Annual Report"
                  existingDocument={getDocumentByType("annual_report")}
                  onUploadComplete={(doc) => setDocuments(prev => [...prev.filter(d => d.document_type !== doc.document_type), doc])}
                  onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                />
                <DocumentUpload
                  userId={userId}
                  organizationId={organization.id}
                  documentType="grant_report"
                  label="Previous Grant Reports"
                  existingDocument={getDocumentByType("grant_report")}
                  onUploadComplete={(doc) => setDocuments(prev => [...prev.filter(d => d.document_type !== doc.document_type), doc])}
                  onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                />
                <DocumentUpload
                  userId={userId}
                  organizationId={organization.id}
                  documentType="abn_certificate"
                  label="ABN Certificate (for Australian orgs)"
                  existingDocument={getDocumentByType("abn_certificate")}
                  onUploadComplete={(doc) => setDocuments(prev => [...prev.filter(d => d.document_type !== doc.document_type), doc])}
                  onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                />
              </div>
            )}
          </div>

          {/* Section E: Partnership Preferences */}
          <div className="space-y-3">
            <SectionHeader 
              id="preferences" 
              title="Section E: Partnership Preferences" 
              completed={!!formData.preferred_communication}
            />
            {expandedSections.preferences && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Communication Method</Label>
                  <Select
                    value={formData.preferred_communication}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_communication: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNICATION_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Interest in Consulting Services</Label>
                    <p className="text-sm text-muted-foreground">
                      Would you like to learn more about our services?
                    </p>
                  </div>
                  <Switch
                    checked={formData.consulting_interest}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consulting_interest: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current_challenges">Specific Needs/Challenges</Label>
                  <Textarea
                    id="current_challenges"
                    rows={3}
                    placeholder="What challenges are you facing? How can we help?"
                    value={formData.current_challenges}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_challenges: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Continue Later
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !formData.mission || !formData.activities}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile & Submit for Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionForm;
