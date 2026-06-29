import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/toast";
import { useAuth } from "../../context/AuthContext";

/**
 * OAuth Callback Page
 * 
 * This page handles the OAuth redirect from Google/Facebook.
 * The backend redirects here with a JWT token in the URL query params.
 * 
 * Flow:
 * 1. User clicks "Login with Google" → Redirects to backend
 * 2. Backend handles OAuth → Redirects back here with token
 * 3. This component extracts token, saves it, and redirects to dashboard
 */
export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get token from URL query params
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      // Handle errors
      if (error) {
        console.error("OAuth error:", error);
        
        if (error === "oauth_failed") {
          toast.error("Authentication failed. Please try again.");
        } else if (error === "google_auth_failed") {
          toast.error("Google authentication failed. Please try again.");
        } else if (error === "facebook_auth_failed") {
          toast.error("Facebook authentication failed. Please try again.");
        } else if (error === "server_error") {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Authentication failed. Please try again.");
        }
        
        navigate("/login");
        return;
      }

      // Validate token
      if (!token) {
        toast.error("No authentication token received.");
        navigate("/login");
        return;
      }

      try {
        // Save token to context and localStorage
        setToken(token);

        // Fetch user data with the token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);

        // Success! Redirect to home
        toast.success("Welcome! You're now logged in.");
        navigate("/");
      } catch (err) {
        console.error("Error processing OAuth callback:", err);
        toast.error("Failed to complete login. Please try again.");
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser, setToken]);

  // Loading state
  return (
    <main className="grow pt-24 pb-xl flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mb-4"></div>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Completing your login...
        </p>
      </div>
    </main>
  );
}
