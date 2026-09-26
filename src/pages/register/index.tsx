import { Form, Formik, type FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../components/input";
import { passwordRules, registerInitialValues } from "../../utils/constants";
import { registerSchema } from "../../utils/validation";
import { getApiFieldErrors, getApiErrorMessage } from "../../utils/api-error";
import type { RegisterValues } from "../../types";
import { useAuth } from "../../context/auth-context";

const REGISTER_FIELDS = ["username", "email", "password"];

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = async (values: RegisterValues, helpers: FormikHelpers<RegisterValues>) => {
    const failure = await register(values);

    if (!failure) return;

    // Anything the API named after a field is shown under that field; a failure
    // with no recognisable field (a conflict, a server error) falls back to a
    // toast so the reason is never swallowed.
    const fieldErrors = getApiFieldErrors(failure, REGISTER_FIELDS);

    Object.entries(fieldErrors).forEach(([field, message]) => helpers.setFieldError(field, message));

    if (!Object.keys(fieldErrors).length) {
      toast.error(getApiErrorMessage(failure, "Could not create the account."));
    }

    await helpers.setSubmitting(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Create an account</h2>
      </div>

      <div className="mt-10 sm:mx-auto w-full sm:max-w-sm">
        <Formik
          initialValues={registerInitialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-8">
            <Input label="Username" name="username" type="text" />
            <Input label="Email address" name="email" type="email" />
            <Input label="Password" name="password" type="password" />

            <ul className="text-sm text-zinc-400 space-y-1">
              {passwordRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>

            <div>
              <button type="submit" className="submit-button">
                Create account
              </button>
            </div>
          </Form>
        </Formik>

        <p className="mt-10 text-center text-sm/6 text-grey-50">
          Already have an account?
          <Link to="/login" className="font-semibold text-yellow-55 hover:text-yellow-60 ps-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
