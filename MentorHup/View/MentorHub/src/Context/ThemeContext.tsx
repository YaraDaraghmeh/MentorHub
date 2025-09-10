import React, {
  createContext,
  useState,
  useContext,
   type ReactNode,
  useMemo,
  useEffect,
} from "react";

type ThemeContextType = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("isDark");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("isDark", JSON.stringify(isDark));
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  const toggle = () => setIsDark((p) => !p);

  const value = useMemo(() => ({ isDark, setIsDark, toggle }), [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
