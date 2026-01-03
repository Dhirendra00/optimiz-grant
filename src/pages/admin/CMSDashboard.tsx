import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Award, Users, Briefcase, Megaphone, Settings } from "lucide-react";
import { BlogPostsManager } from "@/components/cms/BlogPostsManager";
import { GrantsManager } from "@/components/cms/GrantsManager";
import { TeamMembersManager } from "@/components/cms/TeamMembersManager";
import { JobOpportunitiesManager } from "@/components/cms/JobOpportunitiesManager";
import { AnnouncementsManager } from "@/components/cms/AnnouncementsManager";
import { ServicesManager } from "@/components/cms/ServicesManager";

const CMSDashboard = () => {
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground">Manage all website content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl">
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="grants" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Grants</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog">
          <BlogPostsManager />
        </TabsContent>

        <TabsContent value="grants">
          <GrantsManager />
        </TabsContent>

        <TabsContent value="team">
          <TeamMembersManager />
        </TabsContent>

        <TabsContent value="jobs">
          <JobOpportunitiesManager />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementsManager />
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSDashboard;
