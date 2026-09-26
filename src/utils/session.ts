/**
 * Mirrors the session for the UI only. The auth cookie is httpOnly, so this
 * flag is never trusted on its own — it only records whether a session was
 * established, so that the app can skip the profile request on anonymous
 * visits and knows whether a token refresh is worth attempting.
 */
const LOGGED_IN_KEY = "isLoggedIn";

const isLoggedIn = () => localStorage.getItem(LOGGED_IN_KEY) === "true";

const setLoggedIn = (value: boolean) => localStorage.setItem(LOGGED_IN_KEY, String(value));

export { isLoggedIn, setLoggedIn };
