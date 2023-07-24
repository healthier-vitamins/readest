import * as yup from "yup";
import { specialSymbolsRegex } from "../regex";

yup.setLocale({
  mixed: { required: "Field cannot be empty." },
  string: {
    email: "Invalid email.",
  },
});

const createBookModalSchema = yup
  .object({
    bookName: yup
      .string()
      .required()
      .test(
        "testing-special-symbols",
        "Special characters not allowed.",
        (value, _context) => {
          const test = specialSymbolsRegex.test(value);
          if (!test) return true;
        }
      )
      .test(
        "testing-space",
        "Special characters not allowed.",
        (value, _context) => {
          const test = / /g.test(value);
          if (!test) return true;
        }
      ),
  })
  .required();

export type createBookModalData = yup.InferType<typeof createBookModalSchema>;
export default createBookModalSchema;
