import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { InviteCodesManager } from "@/components/cms/InviteCodesManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const InviteManagement = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Invite Code Management</h1>
          <p className="text-muted-foreground">
            Generate and manage invite codes for new users with pre-assigned roles
          </p>
        </div>
        <InviteCodesManager />
      </main>
      <Footer />
    </div>
  );
};

export default InviteManagement;