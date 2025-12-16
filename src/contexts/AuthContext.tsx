import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, inviteCode?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'visitor' | 'organization' | 'consultant' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user role:", error);
      } else if (data) {
        setUserRole(data.role);
      } else {
        console.warn("No role found for user:", userId);
        setUserRole(null);
      }
    } catch (err) {
      console.error("Failed to fetch user role:", err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, inviteCode?: string) => {
    try {
      // If invite code provided, validate it first
      if (inviteCode) {
        const { data: inviteData, error: inviteError } = await supabase
          .from("invite_codes")
          .select("*")
          .eq("code", inviteCode)
          .eq("used", false)
          .single();

        if (inviteError || !inviteData) {
          return { error: { message: "Invalid or expired invite code" } };
        }

        if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
          return { error: { message: "Invite code has expired" } };
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            invite_code: inviteCode,
          },
        },
      });

      // If signup successful and invite code provided, consume it and notify admins
      if (!error && data.user && inviteCode) {
        const { data: inviteResult, error: consumeError } = await supabase.rpc(
          "validate_and_consume_invite",
          {
            _code: inviteCode,
            _user_id: data.user.id,
          }
        );

        if (consumeError) {
          console.error("Error consuming invite code:", consumeError);
        } else if (inviteResult) {
          // Notify admins about the new registration
          try {
            await supabase.functions.invoke("notify-admin-new-user", {
              body: {
                userId: data.user.id,
                userEmail: email,
                userName: fullName,
                inviteCode: inviteCode,
                assignedRole: inviteResult,
              },
            });
          } catch (notifyError) {
            console.error("Error notifying admins:", notifyError);
            // Don't fail signup if notification fails
          }
        }
      }

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
