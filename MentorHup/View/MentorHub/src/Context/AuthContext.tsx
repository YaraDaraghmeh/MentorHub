import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  refreshToken: string | null;
  roles: "Admin" | "Mentor" | "Mentee" | null;
  userId: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    userId: string;
    roles: "Admin" | "Mentor" | "Mentee";
    email: string;
    accessToken: string;
    refreshToken: string;
    userName: string;
  }) => void;
  logout: () => void;
  updateAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<"Admin" | "Mentor" | "Mentee" | null>(
    (localStorage.getItem("roles") as "Admin" | "Mentor" | "Mentee") || null
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken && roles && userId);

  // Function to navigate based on role
  const navigateToRole = (userRole: "Admin" | "Mentor" | "Mentee") => {
    switch (userRole) {
      case "Admin":
        navigate("/admin/dashboard");
        break;
      case "Mentor":
        navigate("/mentor/dashboard");
        break;
      case "Mentee":
        navigate("/mentee/main");
        break;
      default:
        navigate("/login");
    }
  };

  // Save data when login
  const setAuth = ({
    userId,
    roles,
    email,
    accessToken,
    refreshToken,
    userName,
  }: {
    userId: string;
    roles: "Admin" | "Mentor" | "Mentee";
    email: string;
    accessToken: string;
    refreshToken: string;
    userName: string;
  }) => {
    console.log("setAuth called with:", { userId, roles, email });

    // Save to localStorage first
    localStorage.setItem("userId", userId);
    localStorage.setItem("roles", roles);
    localStorage.setItem("email", email);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userName", userName);

    // Update state - هذا سيؤدي لإعادة render للـ components
    setUserId(userId);
    setRoles(roles);
    setEmail(email);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserName(userName);

    console.log("Auth state updated, navigating...");

    // Navigate to appropriate page with a slight delay to ensure state update
    setTimeout(() => {
      console.log("Navigating to role:", roles);
      navigateToRole(roles);
    }, 200);
  };

  // When renewing, update token
  const updateAccessToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  // Logout
  const logout = () => {
    setRoles(null);
    setAccessToken(null);
    setRefreshToken(null);
    setEmail(null);
    setUserId(null);

    localStorage.removeItem("roles");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("MessageIdUser");
    localStorage.removeItem("MessageUserName");
    localStorage.removeItem("imageUser");
    localStorage.removeItem("userName");

    navigate("/home");
  };

  // Check authentication on app start
  useEffect(() => {
    // If user is authenticated and on login page, redirect to dashboard
    if (isAuthenticated && window.location.pathname === "/login") {
      navigateToRole(roles!);
    }
  }, [isAuthenticated, roles]);

  return (
    <AuthContext.Provider
      value={{
        roles,
        accessToken,
        refreshToken,
        setAuth,
        updateAccessToken,
        logout,
        email,
        userId,
        isAuthenticated,
        userName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
