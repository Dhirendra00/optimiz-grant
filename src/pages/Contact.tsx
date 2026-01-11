import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-navy py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-primary-foreground/80">
              Get in touch with our team. We're here to help you achieve your funding goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
              <Card className="shadow-card border-2 border-transparent hover:border-feature/20 transition-all">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+61 123 456 789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input id="subject" placeholder="How can we help?" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your needs..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-feature hover:bg-feature/90 text-feature-foreground" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">Reach out through any of these channels.</p>
              <div className="space-y-6">
                <Card className="shadow-card border-2 border-transparent hover:border-feature/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="icon-container group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-feature" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@optimizgrant.com</p>
                        <p className="text-muted-foreground">support@optimizgrant.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-2 border-transparent hover:border-feature/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="icon-container group-hover:scale-110 transition-transform">
                        <Phone className="h-6 w-6 text-feature" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">+61 426 086 532</p>
                        <p className="text-sm text-muted-foreground mt-1">Monday - Friday, 9am - 5pm AEST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-2 border-transparent hover:border-feature/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="icon-container group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-feature" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office</h3>
                        <p className="text-muted-foreground">39 Gwingana Cres</p>
                        <p className="text-muted-foreground">Glen Waverley VIC 3150, Australia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card border-2 border-transparent hover:border-feature/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="icon-container group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6 text-feature" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Link */}
              <Card className="mt-6 bg-accent/10 border-accent/30 shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Have Questions?</h3>
                  <p className="text-muted-foreground mb-4">
                    Check out our frequently asked questions or schedule a consultation to learn more about our services.
                  </p>
                  <Button variant="outline">View FAQs</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 section-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Register your organization today and take the first step toward securing the funding you need
          </p>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            asChild
          >
            <a href="/register">Register Your Organization</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Contact;
