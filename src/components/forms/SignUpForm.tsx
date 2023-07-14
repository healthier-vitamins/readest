import { Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { specialSymbolsRegex } from "../../utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { SignUpFn } from "../popover/SignUpPopover";
import React, { Dispatch, SetStateAction, useEffect } from "react";

// yup.setLocale({
//   mixed: {
//     required: "Field cannot be empty.",
//   },
//   string: {
//     email: "Invalid email.",
//   },
// });

const signUpSchema = yup
  .object({
    name: yup
      .string()
      .required()
      .test(
        "testing-special-symbols",
        "Special characters not allowed.",
        (value, context) => {
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
        (value, context) => {
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

type FormData = yup.InferType<typeof signUpSchema>;

export default function SignUpForm({
  //   resetAllExceptShowPopoverStateAndShow,
  handleSignUp,
  triggerSignUp,
  setTriggerSignUp,
}: {
  //   resetAllExceptShowPopoverStateAndShow: Function;
  handleSignUp: SignUpFn;
  triggerSignUp: boolean;
  setTriggerSignUp: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const {
    signUpState: { isSignUpLoading },
  } = useAppSelector((state) => state.user);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted },
    reset,
    getFieldState,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  console.log("🚀 ~ file: SignUpForm.tsx:74 ~ errors:", errors);

  useEffect(() => {
    if (triggerSignUp) {
      handleSignUp({
        name: getValues().name,
        confirmPassword: getValues().confirmPassword,
        email: getValues().email,
        password: getValues().password,
      });
      setTriggerSignUp(false);
    }
  }, [triggerSignUp]);

  function onSubmit(formData: FormData) {
    console.log(
      "🚀 ~ file: SignUpForm.tsx:116 ~ onSubmit ~ formData:",
      formData
    );
    handleSignUp(formData);
    // resetAllExceptShowPopoverStateAndShow();
    setTriggerSignUp(false);
  }

  return (
    <div className="popover-box">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label className="signup-label">Name</Form.Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                {...register("name")}
                className="signup-form-control"
                isInvalid={errors.name ? true : false}
                // required
                // ref={nameRef}
                // name="name"
                // value={emailNameState.name}
                // onChange={onChange}
              />
            )}
          />
          {errors.name && (
            <div className="signup-error-msg">{errors.name.message}</div>
          )}
          <Form.Label className="signup-label">Email</Form.Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Control
                // type="email"
                {...field}
                {...register("email")}
                className="signup-form-control"
                autoComplete="on"
                isInvalid={errors.email ? true : false}
                // required
                // ref={emailRef}
                // name="email"
                // value={emailNameState.email}
                // onChange={onChange}
              />
            )}
          ></Controller>
          <Form.Label className="signup-label">Password</Form.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                {...register("password")}
                isInvalid={errors.password ? true : false}
                type="password"
                className="signup-form-control"
                // required
                // ref={passwordRef}
                // name="password"
                // value={signUpPasswordCompare.password}
                // onChange={handleSignUpPasswordCompare}
                // isInvalid={
                //   !signUpPasswordCompare.isSame && signUpPasswordCompare.isDirty
                // }
                // autoComplete="on"
              />
            )}
          ></Controller>
          <Form.Label className="signup-label">Confirm Password</Form.Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                {...register("confirmPassword")}
                isInvalid={errors.confirmPassword ? true : false}
                type="password"
                className="signup-form-control"
                // required
                // ref={confirmPasswordRef}
                // name="confirmPassword"
                // value={signUpPasswordCompare.confirmPassword}
                // onChange={handleSignUpPasswordCompare}
                // isInvalid={
                //   !signUpPasswordCompare.isSame && signUpPasswordCompare.isDirty
                // }
                // autoComplete="on"
              />
            )}
          ></Controller>
        </Form.Group>
        <div className="links-container">
          {/* {signUp && signUpPasswordCompare.isDirty && (
          <div className="signup-error-msg">
            Something went wrong, please try again later.
          </div>
        )} */}

          {errors.confirmPassword && (
            <div className="signup-error-msg">
              {errors.confirmPassword.message}
            </div>
          )}
          <div
            className="popover-state-link"
            onClick={() => {
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
              // resetAllExceptShowPopoverStateAndShow();
            }}
          >
            Already have an account? Login.
          </div>
          <div className="signup-popover-button-container">
            <button
              className={
                isDirty
                  ? "create-book-modal-cfm-btn"
                  : "create-book-modal-cfm-btn-disabled"
              }
              disabled={!isDirty}
            >
              {isSignUpLoading && isDirty && isSubmitted && (
                <React.Fragment>
                  <Spinner
                    animation="border"
                    id="signup-loading-spinner"
                    size="sm"
                  ></Spinner>
                  &nbsp;
                </React.Fragment>
              )}
              Sign Up
            </button>
            <button
              className="create-book-modal-cancel-btn"
              onClick={() => {
                dispatch(setShowPopoverState(false));
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
