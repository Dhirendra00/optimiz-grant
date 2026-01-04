import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Pricing from "./pages/Pricing";
import Opportunities from "./pages/Opportunities";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import UserDashboard from "./pages/UserDashboard";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import CMSDashboard from "./pages/admin/CMSDashboard";
import UserManagement from "./pages/admin/UserManagement";
import InviteManagement from "./pages/admin/InviteManagement";
import ProfileReviewQueue from "./pages/admin/ProfileReviewQueue";
import NotificationsCenter from "./pages/admin/NotificationsCenter";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import HelpSupport from "./pages/admin/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main App component with AuthProvider inside BrowserRouter
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="team" element={<Team />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="organization">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Admin Routes with Sidebar Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="cms" element={<CMSDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="invites" element={<InviteManagement />} />
              <Route path="profiles" element={<ProfileReviewQueue />} />
              <Route path="notifications" element={<NotificationsCenter />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="help" element={<HelpSupport />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
