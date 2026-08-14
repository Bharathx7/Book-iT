import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "../services/auth.api";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("bookit_user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("bookit_access_token")
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => localStorage.getItem("bookit_refresh_token")
  );

  const login = async (data: LoginRequest) => {
    const response = await loginUser(data);

    setUser(response.user);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    localStorage.setItem(
      "bookit_user",
      JSON.stringify(response.user)
    );

    localStorage.setItem(
      "bookit_access_token",
      response.accessToken
    );

    localStorage.setItem(
      "bookit_refresh_token",
      response.refreshToken
    );

    return response.user;
  };

  const register = async (data: RegisterRequest) => {
    await registerUser(data);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("bookit_user");
    localStorage.removeItem("bookit_access_token");
    localStorage.removeItem("bookit_refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}