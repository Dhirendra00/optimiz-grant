import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, hasRole, primaryRole, loading } = useAuth();

  // Show loading while auth is loading OR while user exists but roles haven't loaded yet
  if (loading || (user && primaryRole === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role (using hasRole which checks the roles array)
  if (requiredRole && !hasRole(requiredRole as any)) {
    // Redirect based on user's primary (highest privilege) role
    if (primaryRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (primaryRole === "consultant") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
