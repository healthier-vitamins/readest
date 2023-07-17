import * as yup from "yup";

yup.setLocale({
  mixed: { required: "Field cannot be empty." },
  string: {
    email: "Invalid email.",
  },
});

const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    //   .test(
    //     "trailing-whitespace",
    //     "Space not allowed at start/end of field.",
    //     (value, context) => {
    //       const start = / /.test(value[0]);
    //       const end = / /.test(value.substring(value.length - 1));
    //       if (!start && !end) return true;
    //     }
    //   ),
  })
  .required();

export type loginFormData = yup.InferType<typeof loginSchema>;
export default loginSchema;
