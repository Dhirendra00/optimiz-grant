import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AdminLayout() {
  const [pendingNotifications, setPendingNotifications] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("registration_status", "profile_submitted");
      
      setPendingNotifications(count || 0);
    } catch (error) {
      console.error("Failed to fetch pending count:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AdminHeader pendingNotifications={pendingNotifications} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet context={{ refreshNotifications: fetchPendingCount }} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
