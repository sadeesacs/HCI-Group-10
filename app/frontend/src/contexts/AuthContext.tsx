import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export { AuthContext };

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  }, []);

  // Sync when other tabs/components update localStorage
  useEffect(() => {
    const sync = () => {
      setUser(readStoredUser());
      setToken(localStorage.getItem("authToken"));
    };
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", (e) => {
      if (e.key === "authToken" || e.key === "authUser") sync();
    });
    return () => {
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
