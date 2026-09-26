import { createContext, useContext } from "react";
import type { LoginValues, RegisterValues, User } from "../types";
import type { ApiFailure } from "../utils/api-error";

export interface IAuthContext {
  loading: boolean;
  user: User | null | undefined;
  /**
   * Resolves to `null` on success, or the failure so the form can attach each
   * message to the field it belongs to instead of only raising a toast.
   */
  register: (values: RegisterValues) => Promise<ApiFailure | null>;
  /**
   * Resolves to `null` on success, or the failure. The caller must check this
   * before navigating: the promise is never rejected, so an unguarded
   * `.then(...)` would also run after a rejected sign-in.
   */
  login: (values: LoginValues) => Promise<ApiFailure | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

/**
 * Kept in a non-component module so the `react-refresh` lint rule does not
 * reject a file that exports both a component and a hook.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
