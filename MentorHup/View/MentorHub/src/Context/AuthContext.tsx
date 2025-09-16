import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  refreshToken: string | null;
  roles: "Admin" | "Mentor" | "Mentee" | null;
  userId: string | null;
  setAuth: (data: {
    userId: string;
    roles: "Admin" | "Mentor" | "Mentee";
    email: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
  updateAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

  //save data, when login
  const setAuth = ({
    userId,
    roles,
    email,
    accessToken,
    refreshToken,
  }: {
    userId: string;
    roles: "Admin" | "Mentor" | "Mentee";
    email: string;
    accessToken: string;
    refreshToken: string;
  }) => {
    setUserId(userId);
    setRoles(roles);
    setEmail(email);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("userId", userId);
    localStorage.setItem("roles", roles);
    localStorage.setItem("email", email);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  //when renewing, update token
  const updateAccessToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  //logout
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
  };

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
