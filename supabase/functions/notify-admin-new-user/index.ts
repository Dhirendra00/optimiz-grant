import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  userEmail: string;
  userName: string;
  inviteCode: string;
  assignedRole: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, userEmail, userName, inviteCode, assignedRole }: NotificationRequest = await req.json();

    console.log("Processing new user notification:", { userId, userEmail, userName, inviteCode, assignedRole });

    // Get all admin users
    const { data: adminRoles, error: adminError } = await supabaseClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminError) {
      console.error("Error fetching admin roles:", adminError);
      throw adminError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admin users found to notify");
      return new Response(
        JSON.stringify({ message: "No admins to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get admin emails
    const adminIds = adminRoles.map((role) => role.user_id);
    const { data: adminProfiles, error: profileError } = await supabaseClient
      .from("profiles")
      .select("email")
      .in("id", adminIds);

    if (profileError) {
      console.error("Error fetching admin profiles:", profileError);
      throw profileError;
    }

    const adminEmails = adminProfiles?.map((profile) => profile.email) || [];

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending notifications to ${adminEmails.length} admin(s)`);

    // Get role badge color
    const getRoleBadgeColor = (role: string) => {
      switch (role) {
        case "admin": return "#ef4444";
        case "consultant": return "#3b82f6";
        case "organization": return "#22c55e";
        default: return "#6b7280";
      }
    };

    // Send email to all admins
    const emailPromises = adminEmails.map(async (adminEmail) => {
      return resend.emails.send({
        from: "OptimizGrant <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New User Registration: ${userName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New User Registration</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">A new user has registered using an invite code:</p>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">User Name:</td>
                      <td style="padding: 8px 0;">${userName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                      <td style="padding: 8px 0;">${userEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Invite Code:</td>
                      <td style="padding: 8px 0; font-family: monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; display: inline-block;">${inviteCode}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Assigned Role:</td>
                      <td style="padding: 8px 0;">
                        <span style="background: ${getRoleBadgeColor(assignedRole)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 500; text-transform: capitalize;">
                          ${assignedRole}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Registration Time:</td>
                      <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    You can manage users and invite codes from your admin dashboard.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>This is an automated notification from OptimizGrant</p>
              </div>
            </body>
          </html>
        `,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    console.log(`Email notifications sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        notified: successCount,
        failed: failureCount 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-admin-new-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
