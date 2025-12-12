import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      // Check if this is a redirect from Supabase email confirmation
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      // Also check URL params for error
      const errorDescription = searchParams.get("error_description");
      if (errorDescription) {
        setStatus("error");
        setErrorMessage(errorDescription);
        return;
      }

      if (accessToken && refreshToken && type === "signup") {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          // Update profile to verified_incomplete status
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            await supabase
              .from("profiles")
              .update({ 
                email_verified: true, 
                registration_status: "verified_incomplete" 
              })
              .eq("id", currentUser.id);
          }

          setStatus("success");
        } catch (error: any) {
          console.error("Verification error:", error);
          setStatus("error");
          setErrorMessage(error.message || "Verification failed");
        }
      } else if (user) {
        // Already logged in
        setStatus("success");
      } else {
        // No verification tokens and not logged in
        setStatus("error");
        setErrorMessage("Invalid or expired verification link");
      }
    };

    verifyEmail();
  }, [searchParams, user]);

  // Countdown and redirect for success
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (status === "success" && countdown === 0) {
      navigate("/dashboard");
    }
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          {status === "loading" && (
            <>
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
                <CardDescription>Please wait while we verify your email address...</CardDescription>
              </CardHeader>
            </>
          )}

          {status === "success" && (
            <>
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription className="text-base">
                  Your email has been verified successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Redirecting to your dashboard in {countdown} seconds...
                </p>
                <Button onClick={() => navigate("/dashboard")} className="w-full">
                  Go to My Dashboard
                </Button>
              </CardContent>
            </>
          )}

          {status === "error" && (
            <>
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Verification Failed</CardTitle>
                <CardDescription className="text-base text-destructive">
                  {errorMessage || "This verification link has expired or is invalid"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                  <p>If you haven't verified your email yet, please try logging in and we'll send you a new verification link.</p>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => navigate("/login")} className="w-full">
                    Go to Login
                  </Button>
                  <Button onClick={() => navigate("/register")} variant="outline" className="w-full">
                    Create New Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Need help? Contact{" "}
                  <a href="mailto:info@optimizgrant.com" className="text-primary hover:underline">
                    info@optimizgrant.com
                  </a>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;