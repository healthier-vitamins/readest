import { Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import loginSchema, {
  loginFormData,
} from "../../utils/yupSchemas.ts/loginSchema";
import { apiLogin } from "../../store/apis/user.api";

interface HandleLoginParams {
  email: string;
  password: string;
}

export type HandleLoginFn = (params: HandleLoginParams) => Promise<void>;

export default function LoginForm({
  closePopover,
}: {
  // setTriggerLogin: Dispatch<SetStateAction<boolean>>;
  closePopover: boolean;
}) {
  const { isLoginLoading } = useAppSelector((state) => state.user);
  const {
    showPopoverState: { show },
  } = useAppSelector((state) => state.state);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isDirty, isSubmitting },
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
    if (closePopover) {
      const formData = getValues();
      window.localStorage.setItem("formData", JSON.stringify(formData));
    } else if (!closePopover) {
      let formData = window.localStorage.getItem("formData");
      if (formData && formData !== null) {
        const parsed = JSON.parse(formData);
        setValue("email", parsed["email"]);
        setValue("password", parsed["password"]);
      }
    }
  }, [closePopover]);

  // event listener for "Enter" key only on login and signUp forms
  useEffect(() => {
    if (show) {
      function handleEnter(e: KeyboardEvent) {
        if (e.key === "Enter" && !isLoginLoading && !isSubmitting) {
          handleLogin(getValues());
        }
      }

      window.addEventListener("keyup", handleEnter);
      return () => {
        window.removeEventListener("keyup", handleEnter);
      };
    }
  }, [show, isSubmitting, isLoginLoading]);

  function handleLogin(formData: { email: string; password: string }) {
    if (!isSubmitting && !isLoginLoading) {
      dispatch(apiLogin(formData));
    }
  }

  function onSubmit(data: loginFormData) {
    handleLogin(data);
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
          />
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
              if (!isLoginLoading) {
                dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_SIGNUP));
              }
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
              {isLoginLoading && isSubmitted && (
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
