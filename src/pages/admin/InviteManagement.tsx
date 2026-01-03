import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { InviteCodesManager } from "@/components/cms/InviteCodesManager";

const InviteManagement = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Invite Code Management</h1>
        <p className="text-muted-foreground">
          Generate and manage invite codes for new users with pre-assigned roles
        </p>
      </div>
      <InviteCodesManager />
    </div>
  );
};

export default InviteManagement;
