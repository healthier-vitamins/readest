import { Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect } from "react";
import { HandleLoginFn } from "../popover/SignUpPopover";
import loginSchema, {
  loginFormData,
} from "../../utils/yupSchemas.ts/loginSchema";

export default function LoginForm({
  // resetAllExceptShowPopoverStateAndShow,
  handleLogin,
  triggerLogin,
  setTriggerLogin,
  closePopover,
}: {
  // resetAllExceptShowPopoverStateAndShow: Function;
  handleLogin: HandleLoginFn;
  triggerLogin: boolean;
  setTriggerLogin: Dispatch<SetStateAction<boolean>>;
  closePopover: boolean;
}) {
  const { loginState } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isDirty },
    control,
    // watch,
    getValues,
    // reset,
    setValue,
  } = useForm<loginFormData>({
    resolver: yupResolver(loginSchema),
    // mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (triggerLogin) {
      handleLogin({ email: getValues().email, password: getValues().password });
    }
  }, [triggerLogin]);

  useEffect(() => {
    if (closePopover) {
      const formData = getValues();
      window.localStorage.setItem("formData", JSON.stringify(formData));
    } else if (!closePopover) {
      let formData = window.localStorage.getItem("formData");
      if (formData && formData !== null) {
        const parsed = JSON.parse(formData);
        console.log(
          "🚀 ~ file: SignUpForm.tsx:119 ~ useEffect ~ formData:",
          parsed
        );
        setValue("email", parsed["email"]);
        setValue("password", parsed["password"]);
      }
    }
  }, [closePopover]);

  function onSubmit(data: loginFormData) {
    handleLogin(data);
    setTriggerLogin(false);
    // reset();
  }
  return (
    <div className="popover-box">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label className="signup-label">Email</Form.Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                className="signup-form-control"
                {...register("email")}
                isInvalid={errors?.email ? true : false}
              />
            )}
          />
          {errors.email?.message && (
            <div className="signup-error">
              <small className="signup-error-msg">{errors.email.message}</small>
            </div>
          )}

          <Form.Label className="signup-label">Password</Form.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="password"
                className="signup-form-control"
                autoComplete="on"
                {...register("password")}
                isInvalid={errors?.password ? true : false}
              />
            )}
          ></Controller>
          {errors.password?.message && (
            <div className="signup-error">
              <div className="signup-error-msg">{errors.password.message}</div>
            </div>
          )}
        </Form.Group>
        <div className="links-container">
          <div
            className="popover-state-link"
            onClick={() => {
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_SIGNUP));
              // resetAllExceptShowPopoverStateAndShow();
            }}
          >
            Don't have an account? Sign up.
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
              {loginState.isLoginLoading && isSubmitted && (
                <Spinner
                  animation="border"
                  id="signup-loading-spinner"
                  size="sm"
                ></Spinner>
              )}
              Login
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
