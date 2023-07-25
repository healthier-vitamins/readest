import { Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { SignUpFn } from "../popover/SignUpPopover";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import signUpSchema, {
  signUpFormData,
} from "../../utils/yupSchemas.ts/signUpSchema";

export default function SignUpForm({
  handleSignUp,
  triggerSignUp,
  setTriggerSignUp,
  closePopover,
}: {
  handleSignUp: SignUpFn;
  triggerSignUp: boolean;
  setTriggerSignUp: Dispatch<SetStateAction<boolean>>;
  closePopover: boolean;
}) {
  const dispatch = useAppDispatch();
  const { isSignUpLoading } = useAppSelector((state) => state.user);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitted },
    // reset,
    // getFieldState,
    getValues,
    setValue,
  } = useForm<signUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    // shouldUnregister: false,
  });

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

  // type states = "email" | "password" | "email" | "confirmPassword";

  // useEffect(() => {
  //   // if (!show) {
  //   // [
  //   //   {
  //   //     name: "name",
  //   //     value: watchedValues.name,
  //   //   },
  //   //   {
  //   //     name: "email",
  //   //     value: watchedValues.email,
  //   //   },
  //   //   {
  //   //     name: "password",
  //   //     value: watchedValues.password,
  //   //   },
  //   //   {
  //   //     name: "confirmPassword",
  //   //     value: watchedValues.confirmPassword,
  //   //   },
  //   // ].forEach(({ name, value }: { name: states; value: string }) =>
  //   //   setValue(name, value)
  //   // );

  //   if (
  //     watchedValues.name &&
  //     watchedValues.name !== "" &&
  //     / /g.test(watchedValues.name) === false
  //   ) {
  //     setValue("name", watchedValues.name);
  //     console.log(
  //       "🚀 ~ file: SignUpForm.tsx:71 ~ useEffect ~ getValues().name:",
  //       watchedValues
  //     );
  //   }
  //   // }
  // }, [
  //   watchedValues.confirmPassword ||
  //     watchedValues.email ||
  //     watchedValues.name ||
  //     watchedValues.confirmPassword,
  // ]);

  useEffect(() => {
    if (closePopover) {
      const formData = getValues();
      window.localStorage.setItem("formData", JSON.stringify(formData));
    } else if (!closePopover) {
      let formData = window.localStorage.getItem("formData");
      if (formData && formData !== null) {
        const parsed = JSON.parse(formData);
        setValue("email", parsed["email"]);
        setValue("name", parsed["name"]);
        setValue("password", parsed["password"]);
        setValue("confirmPassword", parsed["confirmPassword"]);
      }
    }
  }, [closePopover]);

  function onSubmit(formData: signUpFormData) {
    console.log("hit ");
    handleSignUp(formData);
    setTriggerSignUp(false);
  }

  // useEffect(() => {
  //   console.log(
  //     "🚀 ~ file: SignUpForm.tsx:130 ~ useEffect ~ isSignUpLoading:",
  //     isSignUpLoading
  //   );
  //   console.log(
  //     "🚀 ~ file: SignUpForm.tsx:130 ~ useEffect ~ isSubmitting:",
  //     isSubmitting
  //   );
  //   if (!isSubmitting && !isSignUpLoading) {
  //     console.log("hit ");
  //     onSubmit(getValues());
  //   }
  // }, [isSubmitting, isSignUpLoading]);

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
                autoComplete="on"
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
                {...field}
                {...register("email")}
                className="signup-form-control"
                autoComplete="on"
                isInvalid={errors.email ? true : false}
              />
            )}
          ></Controller>
          {errors.email && (
            <div className="signup-error-msg">{errors.email.message}</div>
          )}
          <Form.Label className="signup-label">Password</Form.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                {...register("password")}
                isInvalid={
                  errors.password ? true : errors.confirmPassword ? true : false
                }
                type="password"
                className="signup-form-control"
                autoComplete="on"
              />
            )}
          ></Controller>
          {errors.password && (
            <div className="signup-error-msg">{errors.password.message}</div>
          )}
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
                autoComplete="on"
              />
            )}
          ></Controller>
          {errors.confirmPassword && (
            <div className="signup-error-msg">
              {errors.confirmPassword.message}
            </div>
          )}
        </Form.Group>
        <div className="links-container">
          <div
            className="popover-state-link"
            onClick={() => {
              if (!isSignUpLoading) {
                dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
              }
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
