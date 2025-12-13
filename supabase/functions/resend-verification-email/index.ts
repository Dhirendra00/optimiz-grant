import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendEmailRequest {
  email: string;
}

// Generate a secure 64-character token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
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

    const { email }: ResendEmailRequest = await req.json();

    console.log("Resending verification email to:", email);

    // Find user by email
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, full_name, email_verified")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found:", profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No account found with this email address." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if already verified
    if (profile.email_verified) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This email is already verified. Please log in to your account." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Invalidate any existing tokens for this user
    await supabaseClient
      .from("verification_tokens")
      .update({ used: true })
      .eq("user_id", profile.id)
      .eq("used", false);

    // Generate new token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store new token
    const { error: tokenError } = await supabaseClient
      .from("verification_tokens")
      .insert({
        user_id: profile.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (tokenError) {
      console.error("Error storing verification token:", tokenError);
      throw tokenError;
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://optimizgrant.com";
    const verificationUrl = `${siteUrl}/verify-email?token=${token}`;
    const userName = profile.full_name || "there";

    // Send branded verification email
    const emailResponse = await resend.emails.send({
      from: "OptimizGrant <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your OptimizGrant Account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header with Logo -->
              <div style="background: linear-gradient(135deg, #0056B3 0%, #003d82 100%); padding: 40px 30px; text-align: center;">
                <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                  <span style="font-size: 32px; font-weight: bold; color: #0056B3;">OG</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">OptimizGrant</h1>
                <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0; font-size: 14px;">Grant Optimization Experts</p>
              </div>
              
              <!-- Main Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                  Hello ${userName}, here's your new verification link!
                </h2>
                
                <p style="color: #4a4a4a; font-size: 16px; margin: 0 0 30px;">
                  You requested a new verification link. Click the button below to verify your email address:
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${verificationUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);">
                    VERIFY MY EMAIL
                  </a>
                </div>
                
                <!-- Alternative Link -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="word-break: break-all; color: #0056B3; font-size: 14px; margin: 0;">
                    <a href="${verificationUrl}" style="color: #0056B3;">${verificationUrl}</a>
                  </p>
                </div>
                
                <!-- Expiry Notice -->
                <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; margin-top: 30px;">
                  <p style="color: #ef4444; font-size: 14px; font-weight: 500; margin: 0;">
                    ⏰ This link expires in 24 hours
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px; text-align: center;">
                  Having trouble? Contact our support team:
                </p>
                <p style="text-align: center; margin: 0;">
                  <a href="mailto:support@optimizgrant.com" style="color: #0056B3; text-decoration: none; font-weight: 500;">
                    support@optimizgrant.com
                  </a>
                </p>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    🔒 For security, this is an automated message. If you didn't request this, please ignore this email.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Bottom Footer -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} OptimizGrant. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Verification email resent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in resend-verification-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
