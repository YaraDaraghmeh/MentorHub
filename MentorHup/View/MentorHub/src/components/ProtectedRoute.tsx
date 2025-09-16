import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {  type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("Admin" | "Mentor" | "Mentee")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Checking authentication:", {
    isAuthenticated,
    roles,
    currentPath: location.pathname,
    allowedRoles
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("LOGGING IN FIRST PLEASE");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have the right role
  if (allowedRoles && roles && !allowedRoles.includes(roles)) {
    console.log(`المستخدم ليس لديه صلاحية للوصول. دوره: ${roles}، الأدوار المسموحة:`, allowedRoles);
    
    // Redirect to appropriate dashboard based on user's role
    switch (roles) {
      case "Admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "Mentor":
        return <Navigate to="/mentor/dashboard" replace />;
      case "Mentee":
        return <Navigate to="/mentee/main" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log("تم السماح بالوصول للصفحة");
  return <>{children}</>;
};

export default ProtectedRoute;