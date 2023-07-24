import * as yup from "yup";
import { specialSymbolsRegex } from "../regex";

const signUpSchema = yup
  .object({
    name: yup
      .string()
      .required()
      .test(
        "testing-special-symbols",
        "Special characters not allowed.",
        (value, _context) => {
          const test = specialSymbolsRegex.test(value);
          if (!test) return true;
        }
      ),
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .test(
        "trailing-whitespace",
        "Space not allowed at start/end of field.",
        (value, _context) => {
          const start = / /.test(value[0]);
          const end = / /.test(value.substring(value.length - 1));
          if (!start && !end) return true;
        }
      ),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Password do not match."),
    //   .test(
    //     "test-same-password",
    //     "Passwords are not similar.",
    //     (value, context) => {
    //       console.log(yup.ref("password"));
    //       return String(yup.ref("password")) === value;
    //     }
    //   ),
  })
  .required();

export type signUpFormData = yup.InferType<typeof signUpSchema>;

export default signUpSchema;
