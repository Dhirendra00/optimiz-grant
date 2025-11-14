import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Target, Users } from "lucide-react";

const Team = () => {
  const leadership = [
    {
      name: "Manoj Khadka",
      role: "Director for Operations",
      bio: "With over 15 years of experience in grant consulting and project management, Manoj leads our operational excellence and strategic vision.",
    },
    {
      name: "Dr. Raju Adhikari",
      role: "Senior Consultant",
      bio: "PhD in International Development with extensive experience in strategic planning and capacity building for non-profit organizations.",
    },
    {
      name: "Dr. Yakindra Timilsena",
      role: "Research & Strategy Lead",
      bio: "Leading our research initiatives with a focus on evidence-based grant strategies and impact measurement.",
    },
  ];

  const experts = [
    {
      name: "Senior Grant Writer",
      role: "Grant Writing Specialist",
      bio: "Expert in crafting compelling proposals with a 95% success rate across multiple sectors.",
    },
    {
      name: "Project Management Lead",
      role: "Project Manager",
      bio: "Certified PMP with experience managing complex multi-million dollar grant-funded projects.",
    },
    {
      name: "Capacity Building Specialist",
      role: "Training & Development",
      bio: "Specialized in organizational development and building sustainable grant management capabilities.",
    },
  ];

  const values = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description: "We strive for the highest standards in every project we undertake",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical practices",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaboration",
      description: "We work as partners with our clients to achieve shared success",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Impact",
      description: "We focus on creating measurable, lasting positive change",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-muted-foreground">
              Meet the passionate experts dedicated to your success. Our diverse team brings together decades of experience in grant consulting, strategy development, and project implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders guiding our vision and strategy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leadership.map((member, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                  <p className="text-primary text-center font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Experts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized professionals delivering excellence in their fields
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {experts.map((member, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                  <p className="text-primary text-center font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-card">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Be part of a team that's making a real difference in the world of grant consulting
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/opportunities">View Open Positions</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Team;
