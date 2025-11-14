import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  Users,
  TrendingUp,
  Search,
  Building,
  HandshakeIcon,
  CheckSquare,
  FolderKanban,
  Lightbulb,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Grant Proposal Writing",
      description:
        "Expertly crafted proposals that clearly articulate your mission, impact, and funding needs. We develop compelling narratives backed by data to maximize your success rate.",
    },
    {
      icon: <FolderKanban className="h-10 w-10 text-primary" />,
      title: "Project Management",
      description:
        "Professional oversight of grant-funded projects from inception to completion. We ensure timelines are met, budgets are managed, and deliverables exceed expectations.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Strategic Development",
      description:
        "Comprehensive strategic planning to align your organizational goals with funding opportunities. We help you build sustainable funding strategies for long-term success.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Capacity Building",
      description:
        "Strengthen your team's grant management capabilities through training, mentorship, and knowledge transfer. Build internal expertise for sustainable success.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Grant Strategy",
      description:
        "Data-driven strategies to identify the most suitable funding opportunities. We analyze your organization's strengths and match them with funder priorities.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Grant Writing",
      description:
        "Professional grant writing services that communicate your vision effectively. From concept papers to full proposals, we craft documents that win funding.",
    },
    {
      icon: <HandshakeIcon className="h-10 w-10 text-primary" />,
      title: "Funder Engagement",
      description:
        "Build and maintain strong relationships with funders. We facilitate meaningful connections and help you communicate your impact effectively to stakeholders.",
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "Grant Acquittals",
      description:
        "Comprehensive reporting and acquittal services ensuring compliance with funder requirements. We handle documentation, financial reporting, and impact assessments.",
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Find Grants",
      description:
        "Expert grant research and identification services. We monitor funding landscapes and identify opportunities that align with your organization's mission and capacity.",
    },
    {
      icon: <Building className="h-10 w-10 text-primary" />,
      title: "Program Design",
      description:
        "Design impactful programs that attract funding and deliver measurable outcomes. We help structure initiatives that align with both funder priorities and community needs.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We learn about your organization, goals, and funding needs",
    },
    {
      step: "02",
      title: "Strategy",
      description: "Develop a tailored approach to maximize your funding success",
    },
    {
      step: "03",
      title: "Implementation",
      description: "Execute the plan with expert guidance and support",
    },
    {
      step: "04",
      title: "Reporting",
      description: "Measure impact and ensure accountability to funders",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Our team will work collaboratively with you to develop customized solutions that drive results and maximize your funding potential
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-all">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                  <Button variant="link" className="mt-4 px-0" asChild>
                    <Link to="/contact">Learn More →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven approach to grant success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground shadow-card-hover">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Funding Strategy?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Let's discuss how our services can help your organization achieve its funding goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">Schedule Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Services;
