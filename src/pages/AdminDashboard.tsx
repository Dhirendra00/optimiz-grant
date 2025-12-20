import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Users, Building2, FileCheck, AlertCircle, FileText, Mail, ClipboardCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    pendingReviews: 0,
    issues: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total organizations
      const { count: orgsCount } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true });

      // Fetch pending profile reviews
      const { count: pendingCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("registration_status", "profile_submitted");

      setStats({
        totalUsers: usersCount || 0,
        totalOrganizations: orgsCount || 0,
        pendingReviews: pendingCount || 0,
        issues: 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Administrator: {user?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">Total organizations</p>
            </CardContent>
          </Card>

          <Card className={stats.pendingReviews > 0 ? "border-accent" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileCheck className={`h-4 w-4 ${stats.pendingReviews > 0 ? "text-accent" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.pendingReviews > 0 ? "text-accent" : ""}`}>
                {stats.pendingReviews}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.issues}</div>
              <p className="text-xs text-muted-foreground">Reported issues</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage website content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/cms">
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Open CMS
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Manage blog posts, grants, team members, jobs, and more
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/users">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/invites">
                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Invite Codes
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                View, edit, and manage all user accounts and roles
              </p>
            </CardContent>
          </Card>

          <Card className={stats.pendingReviews > 0 ? "border-accent" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Profile Review
                {stats.pendingReviews > 0 && (
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                    {stats.pendingReviews} pending
                  </span>
                )}
              </CardTitle>
              <CardDescription>Review and approve organization profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/profiles">
                <Button className="w-full" variant={stats.pendingReviews > 0 ? "default" : "outline"}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Review Profiles
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Approve, request changes, or reject organization profiles
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
