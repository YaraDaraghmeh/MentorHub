import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import GoogleAuthService from "../../Services/googleAuthService";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        // Check if this is a Google auth callback
        if (!GoogleAuthService.isGoogleAuthCallback()) {
          throw new Error("Invalid callback URL");
        }

        // Handle the callback
        const authData = await GoogleAuthService.handleGoogleCallback();
        
        // Process roles similar to regular login
        const roleString = Array.isArray(authData.roles)
          ? (authData.roles[0] as "Admin" | "Mentor" | "Mentee")
          : (authData.roles as "Admin" | "Mentor" | "Mentee");

        // Set authentication data
        await setAuth({
          userId: authData.userId,
          roles: roleString,
          email: authData.email,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        });

        // Clean up URL parameters
        GoogleAuthService.cleanupAuthParams();
        
        console.log("Google authentication successful, redirecting...");
        
        // Get the stored return URL or use role-based default
        const storedReturnUrl = sessionStorage.getItem('googleAuthReturnUrl');
        sessionStorage.removeItem('googleAuthReturnUrl'); // Clean up
        
        if (storedReturnUrl && storedReturnUrl !== "/") {
          navigate(storedReturnUrl, { replace: true });
        } else {
          // Navigate based on role
          switch (roleString) {
            case "Admin":
              navigate("/admin/dashboard", { replace: true });
              break;
            case "Mentor":
              navigate("/mentor/dashboard", { replace: true });
              break;
            case "Mentee":
              navigate("/mentee/main", { replace: true });
              break;
            default:
              navigate("/", { replace: true });
          }
        }
        
      } catch (error) {
        console.error("Google authentication callback failed:", error);
        setError(error instanceof Error ? error.message : "Authentication failed");
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [setAuth, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Completing Google Sign-In...
          </h2>
          <p className="text-white/80">
            Please wait while we process your authentication.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%]">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-semibold mb-2">Authentication Failed</h2>
            <p>{error}</p>
          </div>
          <p className="text-white/80 mb-4">
            Redirecting to login page...
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="bg-white text-[var(--primary)] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
