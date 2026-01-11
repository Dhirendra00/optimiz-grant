import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Target, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  category: string | null;
  display_order: number | null;
}

const Team = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const leadership = teamMembers?.filter(m => m.category === "leadership") || [];
  const experts = teamMembers?.filter(m => m.category !== "leadership") || [];

  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for the highest standards in every project we undertake",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical practices",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaboration",
      description: "We work as partners with our clients to achieve shared success",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Impact",
      description: "We focus on creating measurable, lasting positive change",
    },
  ];

  const TeamMemberCard = ({ member, isLeadership = false }: { member: TeamMember; isLeadership?: boolean }) => (
    <Card className="group shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-transparent hover:border-feature/20 overflow-hidden">
      <CardContent className="pt-8 pb-6">
        <div 
          className={`${isLeadership ? 'w-32 h-32' : 'w-24 h-24'} bg-feature/10 rounded-2xl mx-auto mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}
        >
          {member.photo_url ? (
            <img 
              src={member.photo_url} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className={`${isLeadership ? 'h-16 w-16' : 'h-12 w-12'} text-feature`} />
          )}
        </div>
        <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
        <p className="text-feature text-center font-medium mb-3">{member.position}</p>
        {member.bio && <p className="text-muted-foreground text-center text-sm">{member.bio}</p>}
      </CardContent>
    </Card>
  );

  const SkeletonCard = ({ isLeadership = false }: { isLeadership?: boolean }) => (
    <Card className="shadow-card">
      <CardContent className="pt-8 pb-6">
        <Skeleton className={`${isLeadership ? 'w-32 h-32' : 'w-24 h-24'} rounded-2xl mx-auto mb-6`} />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto mb-3" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-navy py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Meet Our Experts
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-primary-foreground/80">
              Meet the passionate experts dedicated to your success. Our diverse team brings together decades of experience in grant consulting, strategy development, and project implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
              Leading The Way
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders guiding our vision and strategy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {isLoading ? (
              <>
                <SkeletonCard isLeadership />
                <SkeletonCard isLeadership />
                <SkeletonCard isLeadership />
              </>
            ) : leadership.length > 0 ? (
              leadership.map((member) => (
                <TeamMemberCard key={member.id} member={member} isLeadership />
              ))
            ) : (
              <p className="text-muted-foreground text-center col-span-3">No leadership members found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Experts */}
      {(isLoading || experts.length > 0) && (
        <section className="py-20 md:py-28 section-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
                Specialized Professionals
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Experts</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Specialized professionals delivering excellence in their fields
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                experts.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-feature font-semibold text-sm uppercase tracking-wider mb-4">
              What We Believe
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center shadow-card hover:shadow-card-hover transition-all border-2 border-transparent hover:border-feature/20 group"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="icon-container w-16 h-16 mx-auto mb-6 text-feature group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 md:py-28 section-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Be part of a team that's making a real difference in the world of grant consulting
          </p>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            asChild
          >
            <Link to="/opportunities">View Open Positions</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Team;
