import { useEffect, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { LoginValues, RegisterValues, User } from "../types";
import authService from "../services/auth";
import { getApiErrorMessage, readApiError } from "../utils/api-error";
import { AuthContext } from "./auth-context";

/**
 * Mirrors the session for the UI only. The auth cookie is httpOnly, so this
 * flag is never trusted on its own — it just avoids a profile request on
 * anonymous visits.
 */
const LOGGED_IN_KEY = "isLoggedIn";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  // The session is confirmed with the API on every page load, because the
  // cookie that carries it cannot be read from JavaScript.
  useEffect(() => {
    if (localStorage.getItem(LOGGED_IN_KEY) !== "true") {
      setUser(null);

      return;
    }

    const getUser = async () => {
      setLoading(true);

      try {
        setUser(await authService.getProfile());
      } catch {
        setUser(null);
        localStorage.setItem(LOGGED_IN_KEY, "false");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const register = async (values: RegisterValues) => {
    setLoading(true);

    try {
      await authService.register(values);
      toast.success("Account created. You can sign in now.");
      navigate("/login");

      return null;
    } catch (error) {
      // The caller renders these per field, so no toast is raised here.
      return readApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (values: LoginValues) => {
    setLoading(true);

    try {
      const user = await authService.login(values);
      setUser(user);
      localStorage.setItem(LOGGED_IN_KEY, "true");
      toast.success("Signed in successfully.");

      return null;
    } catch (error) {
      // A wrong password is not tied to one field, so it is reported here and
      // handed back only so the form knows not to navigate.
      toast.error(getApiErrorMessage(error, "Sign in failed."));

      return readApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // The cookie may already be gone, so the failure is reported but the
      // local session is still cleared.
      toast.error(getApiErrorMessage(error, "Sign out did not complete."));
    } finally {
      setUser(null);
      localStorage.setItem(LOGGED_IN_KEY, "false");
      navigate("/login");
      toast.success("Signed out.");
    }
  };

  return <AuthContext.Provider value={{ loading, user, register, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthProvider;
