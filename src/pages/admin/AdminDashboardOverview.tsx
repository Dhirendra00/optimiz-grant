import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  Database,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Stats {
  totalUsers: number;
  totalOrganizations: number;
  pendingReviews: number;
  verifiedOrganizations: number;
}

interface RecentActivity {
  id: string;
  action: string;
  table_name: string;
  created_at: string;
  record_id: string | null;
}

const AdminDashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrganizations: 0,
    pendingReviews: 0,
    verifiedOrganizations: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all stats in parallel
      const [usersResult, orgsResult, pendingResult, verifiedResult, activitiesResult] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("organizations").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("registration_status", "profile_submitted"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("registration_status", "verified"),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalOrganizations: orgsResult.count || 0,
        pendingReviews: pendingResult.count || 0,
        verifiedOrganizations: verifiedResult.count || 0,
      });

      setRecentActivities(activitiesResult.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "insert":
        return <CheckCircle2 className="h-4 w-4 text-accent" />;
      case "update":
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case "delete":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedOrganizations} verified
            </p>
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
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pending Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Actions
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingReviews > 0 ? (
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Profile Reviews</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingReviews} pending approval
                    </p>
                  </div>
                </div>
                <Link to="/admin/profiles">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-accent" />
                <p className="text-sm">All caught up!</p>
                <p className="text-xs">No pending actions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 text-sm">
                    {getActionIcon(activity.action)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate capitalize">
                        {activity.action} on {activity.table_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activities</p>
              </div>
            )}
            <Link to="/admin/audit-logs" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Logs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Infrastructure status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Operational
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  API Services
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Operational
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Authentication
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Operational
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link to="/admin/profiles">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span>Review Profiles</span>
              </Button>
            </Link>
            <Link to="/admin/cms">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <FileCheck className="h-6 w-6" />
                <span>Content Management</span>
              </Button>
            </Link>
            <Link to="/admin/invites">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                <span>Invite Codes</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
