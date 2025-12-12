import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Mail, ArrowLeft, Loader2, ChevronDown } from "lucide-react";
import { z } from "zod";

const ORGANIZATION_TYPES = [
  "Non-profit Organization",
  "Charitable Foundation",
  "Government Agency",
  "Educational Institution",
  "Cultural Institution",
  "Social Enterprise",
  "Other",
];

const SERVICES = [
  "Grant proposal writing assistant",
  "Project Design and Implementation Report",
  "Report Writing Assistance",
  "Grant acquittal",
];

const COUNTRIES = [
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "NP", label: "Nepal" },
  { value: "IN", label: "India" },
  { value: "OTHER", label: "Other" },
];

const registrationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(1, "Please select organization type"),
  otherOrgType: z.string().optional(),
  streetAddress: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(1, "Please select a country"),
  servicesRequired: z.array(z.string()).min(1, "Please select at least one service"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms"),
});

type FormData = z.infer<typeof registrationSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const DEFAULT_FORM_DATA: FormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  organizationName: "",
  organizationType: "",
  otherOrgType: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AU",
  servicesRequired: [],
  termsAccepted: false,
};

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verification-sent">("form");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("registration_draft");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          password: "",
          termsAccepted: false,
          servicesRequired: Array.isArray(parsed.servicesRequired) ? parsed.servicesRequired : [],
        }));
      }
    } catch (e) {
      console.log("Could not restore draft");
      localStorage.removeItem("registration_draft");
    }
    setIsHydrated(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Auto-save draft to localStorage (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    const { password, termsAccepted, ...safeDraft } = formData;
    localStorage.setItem("registration_draft", JSON.stringify(safeDraft));
  }, [formData, isHydrated]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesRequired: prev.servicesRequired.includes(service)
        ? prev.servicesRequired.filter(s => s !== service)
        : [...prev.servicesRequired, service],
    }));
    if (errors.servicesRequired) {
      setErrors(prev => ({ ...prev, servicesRequired: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      registrationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof FormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const { data: existingUsers } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", formData.email)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        setErrors({ email: "This email is already registered" });
        toast({
          title: "Email Already Registered",
          description: "This email is already registered. Please login instead.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/verify-email`;

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            job_title: "",
            organization_name: formData.organizationName,
            organization_type: formData.organizationType === "Other" ? formData.otherOrgType : formData.organizationType,
            street_address: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
            services_required: formData.servicesRequired,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create organization record
        const { error: orgError } = await supabase.from("organizations").insert({
          user_id: data.user.id,
          name: formData.organizationName,
          organization_type: formData.organizationType === "Other" ? formData.otherOrgType : formData.organizationType,
          address: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          services_required: formData.servicesRequired,
        });

        if (orgError) {
          console.error("Error creating organization:", orgError);
        }

        // Clear draft
        localStorage.removeItem("registration_draft");
        
        // Show verification sent step
        setStep("verification-sent");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "A new verification email has been sent to your inbox",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "verification-sent") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/30 p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to
              </CardDescription>
              <p className="font-medium text-foreground">{formData.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                <p>Click the link in the email to verify your account and access your dashboard.</p>
                <p className="mt-2">The link will expire in 24 hours.</p>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resendVerificationEmail}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("form")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Registration
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Having trouble? Contact us at{" "}
                <a href="mailto:info@optimizgrant.com" className="text-primary hover:underline">
                  info@optimizgrant.com
                </a>
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Account</h1>
              <p className="text-muted-foreground">
                Join OptimizGrant and start your journey to funding success
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step 1 of 2</span>
                <span className="text-sm text-muted-foreground">Account Setup</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={e => updateField("fullName", e.target.value)}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+61 XXX XXX XXX"
                        value={formData.phone}
                        onChange={e => updateField("phone", e.target.value)}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => updateField("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={e => updateField("password", e.target.value)}
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                  <CardDescription>Tell us about your organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={e => updateField("organizationName", e.target.value)}
                        className={errors.organizationName ? "border-destructive" : ""}
                      />
                      {errors.organizationName && (
                        <p className="text-sm text-destructive">{errors.organizationName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationType">Type of Organization *</Label>
                      <div className="relative">
                        <select
                          id="organizationType"
                          value={formData.organizationType}
                          onChange={e => updateField("organizationType", e.target.value)}
                          className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${errors.organizationType ? "border-destructive" : "border-input"}`}
                        >
                          <option value="">Select type</option>
                          {ORGANIZATION_TYPES.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                      {errors.organizationType && (
                        <p className="text-sm text-destructive">{errors.organizationType}</p>
                      )}
                    </div>
                  </div>
                  
                  {formData.organizationType === "Other" && (
                    <div className="space-y-2">
                      <Label htmlFor="otherOrgType">Please specify organization type</Label>
                      <Input
                        id="otherOrgType"
                        value={formData.otherOrgType}
                        onChange={e => updateField("otherOrgType", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={e => updateField("streetAddress", e.target.value)}
                      className={errors.streetAddress ? "border-destructive" : ""}
                    />
                    {errors.streetAddress && (
                      <p className="text-sm text-destructive">{errors.streetAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={e => updateField("city", e.target.value)}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={e => updateField("state", e.target.value)}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={e => updateField("postalCode", e.target.value)}
                        className={errors.postalCode ? "border-destructive" : ""}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive">{errors.postalCode}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <div className="relative">
                        <select
                          id="country"
                          value={formData.country}
                          onChange={e => updateField("country", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          {COUNTRIES.map(country => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Required */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Services Required</CardTitle>
                  <CardDescription>Select the services you're interested in (multiple selection allowed)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SERVICES.map(service => (
                      <div
                        key={service}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.servicesRequired.includes(service)
                            ? "bg-primary/5 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => toggleService(service)}
                      >
                        <Checkbox
                          checked={formData.servicesRequired.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label className="cursor-pointer flex-1">{service}</Label>
                        {formData.servicesRequired.includes(service) && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.servicesRequired && (
                    <p className="text-sm text-destructive mt-2">{errors.servicesRequired}</p>
                  )}
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3 mb-6">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={checked => updateField("termsAccepted", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{" "}
                        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, and consent to OptimizGrant
                        contacting me regarding services and opportunities *
                      </Label>
                      {errors.termsAccepted && (
                        <p className="text-sm text-destructive">{errors.termsAccepted}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account & Verify Email"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-primary hover:underline">
                      Log in here
                    </a>
                  </p>
                </CardContent>
              </Card>
            </form>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Need assistance? Contact us at{" "}
                <a href="mailto:info@optimizgrant.com" className="text-primary hover:underline">
                  info@optimizgrant.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;