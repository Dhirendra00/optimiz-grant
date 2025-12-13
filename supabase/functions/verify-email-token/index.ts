import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyTokenRequest {
  token: string;
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

    const { token }: VerifyTokenRequest = await req.json();

    console.log("Verifying token:", token.substring(0, 8) + "...");

    // Find the token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      console.error("Token not found:", tokenError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid verification link. Please request a new verification email." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if token is already used
    if (tokenData.used) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This verification link has already been used. Please log in to your account." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This verification link has expired. Please request a new verification email." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark token as used
    const { error: updateTokenError } = await supabaseClient
      .from("verification_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    if (updateTokenError) {
      console.error("Error updating token:", updateTokenError);
    }

    // Update user profile to verified
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({ 
        email_verified: true, 
        registration_status: "verified_incomplete" 
      })
      .eq("id", tokenData.user_id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    // Update auth.users email_confirmed_at using admin API
    const { error: authError } = await supabaseClient.auth.admin.updateUserById(
      tokenData.user_id,
      { email_confirm: true }
    );

    if (authError) {
      console.error("Error confirming email in auth:", authError);
      // Don't throw - profile is already updated
    }

    console.log("Email verified successfully for user:", tokenData.user_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully",
        userId: tokenData.user_id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-email-token function:", error);
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
