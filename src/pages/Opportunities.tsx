import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Handshake, Megaphone, ArrowRight, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Job {
  id: string;
  title: string;
  location: string | null;
  department: string | null;
  description: string;
  requirements: string | null;
  deadline: string | null;
  status: string;
  application_instructions: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  publish_date: string | null;
  priority_level: string | null;
  target_audience: string | null;
  expiration_date: string | null;
}

const Opportunities = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("job_opportunities")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setLoadingJobs(false);
    };

    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("publish_date", { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
      setLoadingAnnouncements(false);
    };

    fetchJobs();
    fetchAnnouncements();
  }, []);

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
            {loadingJobs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : jobs.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No open positions at the moment. Check back soon!
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card
                  key={job.id}
                  className="shadow-card hover:shadow-card-hover transition-all border-2 border-transparent hover:border-feature/20 group"
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <CardTitle className="text-2xl mb-2 group-hover:text-feature transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {job.location || "Remote"} {job.department && `• ${job.department}`}
                        </CardDescription>
                      </div>
                      {job.deadline && (
                        <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
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
              ))
            )}
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
                  We're always looking for strategic partnerships with organizations that share our commitment to making a positive impact.
                </p>
                <h4 className="font-semibold text-lg mb-4 text-feature">Partnership Benefits:</h4>
                <ul className="space-y-3 text-muted-foreground mb-8">
                  {[
                    "Access to our extensive network of clients and funders",
                    "Joint grant opportunities and project collaborations",
                    "Shared resources and expertise",
                    "Co-branded initiatives and thought leadership",
                    "Special discount rates on our services",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
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
            {loadingAnnouncements ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : announcements.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No announcements at the moment.
                </CardContent>
              </Card>
            ) : (
              announcements.map((item) => (
                <Card
                  key={item.id}
                  className="shadow-card hover:shadow-card-hover transition-all border-2 border-transparent hover:border-feature/20 group"
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <CardTitle className="text-xl group-hover:text-feature transition-colors">
                        {item.title}
                      </CardTitle>
                      {item.publish_date && (
                        <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                          {new Date(item.publish_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
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
              <Input type="email" placeholder="Enter your email" className="flex-1 bg-primary-foreground text-foreground" />
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
