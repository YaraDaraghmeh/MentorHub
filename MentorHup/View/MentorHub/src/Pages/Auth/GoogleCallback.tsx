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
        if (!GoogleAuthService.isGoogleAuthCallback())
          throw new Error("Invalid callback URL");

        // 1️⃣ قراءة البيانات من الرابط
        const authData = await GoogleAuthService.handleGoogleCallback();

        // 2️⃣ حفظ البيانات في Context و/أو LocalStorage
        await setAuth(authData);
        localStorage.setItem("authData", JSON.stringify(authData));

        // 3️⃣ تنظيف الرابط
        GoogleAuthService.cleanupAuthParams();

        // 4️⃣ توجيه المستخدم حسب الدور
        const role = Array.isArray(authData.roles) ? authData.roles[0] : authData.roles;
        switch (role) {
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
            navigate("/login", { replace: true });
        }
      } catch (err: any) {
        console.error("Google callback error:", err);
        setError(err.message || "Authentication failed");
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, setAuth]);

  if (loading) return <div>Loading Google authentication...</div>;
  if (error) return <div>Error: {error}</div>;
  return null;
};

export default GoogleCallback;