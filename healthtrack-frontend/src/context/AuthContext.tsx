// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  abhaId?: string;
}

interface StoredAuth {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_KEY = "healthtrack_auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch (e) {
      console.warn("Failed to parse stored auth", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // call backend instead of fake login
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.message || "Login failed");
    }

    const loggedInUser: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      abhaId: data.user.abhaId,
    };

    const token = data.token as string;

    setUser(loggedInUser);
    setToken(token);

    const toStore: StoredAuth = { user: loggedInUser, token };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
