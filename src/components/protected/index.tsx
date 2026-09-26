import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import PageLoader from "../loader/page-loader";

const Protected = () => {
  const { loading, user } = useAuth();
  const location = useLocation();

  // While the profile request is in flight the real auth state is unknown, so
  // rendering the route guard now would bounce a signed-in user out.
  if (loading) return <PageLoader />;

  if (user === null) {
    // `state.from` lets the login page send the user back where they were.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Protected;
