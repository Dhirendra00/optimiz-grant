import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple header to avoid Radix issues
const SimpleHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link to="/" className="flex items-center space-x-3">
        <img src={logo} alt="OptimizGrant Logo" className="h-10 w-10 object-contain rounded-full" />
        <span className="text-2xl font-bold text-primary">OptimizGrant</span>
      </Link>
    </div>
  </header>
);

const SimpleFooter = () => (
  <footer className="border-t bg-muted/30 py-6">
    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} OptimizGrant. All rights reserved.
    </div>
  </footer>
);

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const buttonClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const primaryButtonClasses = `${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
  const outlineButtonClasses = `${buttonClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
  const ghostButtonClasses = `${buttonClasses} hover:bg-accent hover:text-accent-foreground`;

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token provided. Please check your email for the verification link.");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-email-token", {
          body: { token },
        });

        if (error) {
          throw new Error(error.message || "Verification failed");
        }

        if (data?.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data?.error || "Verification failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(error.message || "An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Countdown and redirect for success
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (status === "success" && countdown === 0) {
      navigate("/login");
    }
  }, [status, countdown, navigate]);

  const handleResendEmail = async () => {
    if (!resendEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("resend-verification-email", {
        body: { email: resendEmail },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Email Sent",
          description: "A new verification email has been sent to your inbox",
        });
        setStatus("loading");
        setErrorMessage("");
        // Show a message that they should check email
        setTimeout(() => {
          setStatus("error");
          setErrorMessage("Please check your inbox for the new verification link.");
        }, 2000);
      } else {
        throw new Error(data?.error || "Failed to resend email");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
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
                <CardTitle className="text-2xl">Email Verified Successfully!</CardTitle>
                <CardDescription className="text-base">
                  Your email has been verified. You can now log in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Redirecting to login in {countdown} seconds...
                </p>
                <button 
                  onClick={() => navigate("/login")} 
                  className={`w-full ${primaryButtonClasses}`}
                >
                  Go to Login Now
                </button>
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
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground text-left">
                  <p className="font-medium mb-2">Need a new verification link?</p>
                  <p>Enter your email below and we'll send you a new one.</p>
                </div>
                
                <div className="space-y-2 text-left">
                  <Label htmlFor="resendEmail">Email Address</Label>
                  <Input
                    id="resendEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleResendEmail}
                    disabled={resendLoading}
                    className={`w-full ${primaryButtonClasses}`}
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className={`w-full ${outlineButtonClasses}`}
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className={`w-full ${ghostButtonClasses}`}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Registration
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground pt-4 border-t">
                  Need help? Contact{" "}
                  <a href="mailto:support@optimizgrant.com" className="text-primary hover:underline">
                    support@optimizgrant.com
                  </a>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default VerifyEmail;
