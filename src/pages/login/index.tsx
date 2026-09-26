import { Form, Formik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { loginInitialValues } from "../../utils/constants";
import type { LoginValues } from "../../types";
import { useAuth } from "../../context/auth-context";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set by the route guard so sign in returns the user to the page they wanted.
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  const handleSubmit = async (values: LoginValues) => {
    // `login` resolves with the failure rather than rejecting, so the
    // navigation has to be guarded: otherwise a wrong password still lands on
    // the home page.
    const failure = await login(values);

    if (!failure) navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Sign in</h2>
      </div>

      <div className="mt-10 sm:mx-auto w-full sm:max-w-sm">
        <Formik initialValues={loginInitialValues} onSubmit={handleSubmit}>
          <Form className="space-y-8">
            <Input label="Username" name="username" type="text" />
            <Input label="Password" name="password" type="password" />

            <div>
              <button type="submit" className="submit-button">
                Sign in
              </button>
            </div>
          </Form>
        </Formik>

        <p className="mt-10 text-center text-sm/6 text-grey-50">
          Don&apos;t have an account?
          <Link to="/register" className="font-semibold text-yellow-55 hover:text-yellow-60 ps-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
