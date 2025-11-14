import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Handshake, Megaphone } from "lucide-react";

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
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Opportunities & Announcements</h1>
            <p className="text-xl text-muted-foreground">
              Explore career opportunities, partnership possibilities, and stay updated with our latest news
            </p>
          </div>
        </div>
      </section>

      {/* Job Opportunities */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <Briefcase className="h-10 w-10 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Job Opportunities</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobs.map((job, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base">
                        {job.location} • {job.type}
                      </CardDescription>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Deadline: {job.deadline}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <Button variant="outline">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Handshake className="h-10 w-10 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Partnership Opportunities</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Collaborate With Us</h3>
                <p className="text-muted-foreground mb-6">
                  We're always looking for strategic partnerships with organizations that share our commitment to making a positive impact. Whether you're a funding body, consulting firm, educational institution, or community organization, we'd love to explore collaboration opportunities.
                </p>
                <h4 className="font-semibold text-lg mb-3">Partnership Benefits:</h4>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Access to our extensive network of clients and funders</li>
                  <li>• Joint grant opportunities and project collaborations</li>
                  <li>• Shared resources and expertise</li>
                  <li>• Co-branded initiatives and thought leadership</li>
                  <li>• Special discount rates on our services</li>
                </ul>
                <Button>Contact Us About Partnerships</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <Megaphone className="h-10 w-10 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Latest Announcements</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((item, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{item.date}</span>
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Subscribe to our newsletter for the latest job openings, partnership opportunities, and company news
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground text-foreground"
              />
              <Button type="submit" variant="secondary" size="lg">
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
