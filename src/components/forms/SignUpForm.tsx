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
    setValue,
  } = useForm<signUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
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

  function onSubmit(formData: signUpFormData) {
    handleSignUp(formData);
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
          {/* {signUp && signUpPasswordCompare.isDirty && (
          <div className="signup-error-msg">
            Something went wrong, please try again later.
          </div>
        )} */}

          {/* {errors.confirmPassword && (
            <div className="signup-error-msg">
              {errors.confirmPassword.message}
            </div>
          )} */}
          <div
            className="popover-state-link"
            onClick={() => {
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
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
