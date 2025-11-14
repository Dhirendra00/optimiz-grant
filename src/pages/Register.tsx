import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Register Your Organization</h1>
            <p className="text-xl text-muted-foreground">
              Join OptimizGrant and start your journey to funding success
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name *</Label>
                    <Input id="org-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-number">Registration Number</Label>
                    <Input id="reg-number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input id="state" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code *</Label>
                    <Input id="postal" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="nz">New Zealand</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" placeholder="https://" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Primary Contact Person</CardTitle>
                <CardDescription>Who should we contact regarding this registration?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input id="contact-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-title">Job Title *</Label>
                    <Input id="contact-title" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address *</Label>
                    <Input id="contact-email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number *</Label>
                    <Input id="contact-phone" type="tel" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Profile */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Tell us about your organization's mission and activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year-established">Year Established</Label>
                  <Input id="year-established" type="number" min="1800" max={new Date().getFullYear()} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement *</Label>
                  <Textarea id="mission" rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activities">Core Activities/Services *</Label>
                  <Textarea id="activities" rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <Textarea id="achievements" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-population">Target Population/Beneficiaries</Label>
                  <Textarea id="target-population" rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Partnership Interest */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Partnership & Service Interest</CardTitle>
                <CardDescription>What services are you interested in?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services-interest">Services Required</Label>
                  <Textarea
                    id="services-interest"
                    rows={4}
                    placeholder="Please describe which services you're interested in and your current needs..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenges">Current Challenges</Label>
                  <Textarea
                    id="challenges"
                    rows={4}
                    placeholder="What challenges is your organization currently facing?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Agreement */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy, and consent to OptimizGrant
                      contacting me regarding services and opportunities *
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]">
                Submit Registration
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need assistance? Contact us at{" "}
              <a href="mailto:info@optimizgrant.com" className="text-primary hover:underline">
                info@optimizgrant.com
              </a>{" "}
              or call{" "}
              <a href="tel:+61123456789" className="text-primary hover:underline">
                +61 (0) 123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
