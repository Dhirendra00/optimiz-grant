import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Handshake, Megaphone, ArrowRight, Mail } from "lucide-react";

const Opportunities = () => {
  const jobs = [
    {
      title: "Senior Grant Writer",
      location: "Glen Waverley, VIC / Remote",
      type: "Full-time",
      description: "Experienced grant writer to lead proposal development for non-profit and government sectors.",
      deadline: "March 31, 2025",
    },
    {
      title: "Project Manager - Grant Implementation",
      location: "Melbourne, VIC",
      type: "Full-time",
      description: "Manage multiple grant-funded projects ensuring successful delivery and stakeholder satisfaction.",
      deadline: "April 15, 2025",
    },
    {
      title: "Capacity Building Consultant",
      location: "Remote",
      type: "Contract",
      description: "Provide training and mentorship to organizations developing their grant management capabilities.",
      deadline: "Rolling",
    },
  ];

  const announcements = [
    {
      title: "New Partnership with Australian Charities and Not-for-profits Commission",
      date: "March 1, 2025",
      description: "We're excited to announce our collaboration to support registered charities nationwide.",
    },
    {
      title: "Webinar Series: Grant Writing Fundamentals",
      date: "February 20, 2025",
      description: "Join our free monthly webinar series starting April 2025. Register now for early access.",
    },
    {
      title: "Success Story: $2M Infrastructure Grant Secured",
      date: "February 10, 2025",
      description: "Celebrating with our client who secured major funding for community facility expansion.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-navy py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Join Our Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Opportunities & Announcements</h1>
            <p className="text-xl text-primary-foreground/80">
              Explore career opportunities, partnership possibilities, and stay updated with our latest news
            </p>
          </div>
        </div>
      </section>

      {/* Job Opportunities */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="icon-container mr-4">
              <Briefcase className="h-8 w-8 text-feature" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Job Opportunities</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobs.map((job, index) => (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-card-hover transition-all border-2 border-transparent hover:border-feature/20 group"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-feature transition-colors">{job.title}</CardTitle>
                      <CardDescription className="text-base">
                        {job.location} • <span className="text-feature font-medium">{job.type}</span>
                      </CardDescription>
                    </div>
                    <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                      Deadline: {job.deadline}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{job.description}</p>
                  <Button variant="outline" className="group-hover:bg-feature group-hover:text-feature-foreground group-hover:border-feature transition-all">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 md:py-28 section-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="icon-container mr-4">
              <Handshake className="h-8 w-8 text-feature" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Partnership Opportunities</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-card border-2 border-feature/20">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-semibold mb-4">Collaborate With Us</h3>
                <p className="text-muted-foreground mb-6">
                  We're always looking for strategic partnerships with organizations that share our commitment to making a positive impact. Whether you're a funding body, consulting firm, educational institution, or community organization, we'd love to explore collaboration opportunities.
                </p>
                <h4 className="font-semibold text-lg mb-4 text-feature">Partnership Benefits:</h4>
                <ul className="space-y-3 text-muted-foreground mb-8">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Access to our extensive network of clients and funders
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Joint grant opportunities and project collaborations
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Shared resources and expertise
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Co-branded initiatives and thought leadership
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Special discount rates on our services
                  </li>
                </ul>
                <Button className="bg-feature hover:bg-feature/90 text-feature-foreground">
                  Contact Us About Partnerships
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="icon-container mr-4">
              <Megaphone className="h-8 w-8 text-feature" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Latest Announcements</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((item, index) => (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-card-hover transition-all border-2 border-transparent hover:border-feature/20 group"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <CardTitle className="text-xl group-hover:text-feature transition-colors">{item.title}</CardTitle>
                    <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground whitespace-nowrap">{item.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 md:py-28 section-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-10 text-primary-foreground/80">
              Subscribe to our newsletter for the latest job openings, partnership opportunities, and company news
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground text-foreground"
              />
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Opportunities;
