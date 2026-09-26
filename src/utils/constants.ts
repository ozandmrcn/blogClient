import type { StylesConfig } from "react-select";
import { passwordRequirements } from "./validation";

const loginInitialValues = {
  username: "",
  password: "",
};

const registerInitialValues = {
  username: "",
  email: "",
  password: "",
};

/**
 * Rules enforced by the API's `IsStrongPassword` check, listed on the register
 * form. Derived from the same source the validation uses so the list and the
 * actual check can never disagree.
 */
export const passwordRules = passwordRequirements.map((requirement) => requirement.label);

const mdeOptions = {
  toolbar: [
    "bold",
    "italic",
    "heading",
    "|",
    "quote",
    "unordered-list",
    "ordered-list",
    "|",
    "link",
    "image",
    "code",
    "|",
    "preview",
  ],
  previewClass: ["bg-zinc-100", "text-black", "p-4", "rounded-md"],
  placeholder: "Write your post in Markdown...",
} as const;

/** react-select renders a light menu, so its text has to be forced dark. */
const reactSelectOptions: StylesConfig<{ value: string; label: string }, true> = {
  option: (styles) => ({ ...styles, color: "black" }),
  multiValue: (styles) => ({ ...styles, color: "black" }),
};

export { loginInitialValues, mdeOptions, reactSelectOptions, registerInitialValues };
