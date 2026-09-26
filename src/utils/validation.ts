import * as Yup from "yup";

/**
 * Mirrors `IsStrongPassword` in the API's `BaseUserDto`: 8 characters with at
 * least one lowercase letter, uppercase letter, number and symbol.
 *
 * The on-screen rule list and the validation below are both derived from this
 * one array, so the promise made to the user and the check performed by the
 * browser can never drift apart.
 */
const passwordRequirements = [
  { label: "At least 8 characters", satisfied: (value: string) => value.length >= 8 },
  { label: "One lowercase letter", satisfied: (value: string) => /[a-z]/.test(value) },
  { label: "One uppercase letter", satisfied: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", satisfied: (value: string) => /\d/.test(value) },
  { label: "One symbol", satisfied: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

/** Constrains the form the same way the API's `BaseUserDto` does. */
const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be 20 characters or fewer.")
    .matches(
      /^[a-zA-Z0-9_.-]+$/,
      "Username may only contain letters, numbers, dots, dashes and underscores."
    )
    .required("Username is required."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long.")
    .required("Email address is required."),
  password: Yup.string()
    .required("Password is required.")
    .test("strength", "Password is not strong enough.", function (value) {
      // The first unmet requirement is named, so the user is told what to add
      // rather than just that the password was rejected.
      const missing = passwordRequirements.find((requirement) => !requirement.satisfied(value ?? ""));

      if (!missing) return true;

      return this.createError({ message: `Password needs ${missing.label.toLowerCase()}.` });
    }),
});

export { passwordRequirements, registerSchema };
