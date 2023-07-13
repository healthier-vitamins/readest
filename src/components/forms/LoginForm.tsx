/* eslint-disable @typescript-eslint/ban-types */
import { Button, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof loginSchema>;

export default function LoginForm({
  resetAllExceptShowPopoverStateAndShow,
  onChange,
  handleLogin,
  isSubmitted,
}: {
  resetAllExceptShowPopoverStateAndShow: any;
  onChange: any;
  handleLogin: any;
  isSubmitted: boolean;
}) {
  const { loginState } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormData) {
    console.log("🚀 ~ file: loginForm.tsx:45 ~ onSubmit ~ data:", data);
  }
  console.log("🚀 ~ file: loginForm.tsx:39 ~ errors:", errors);
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
                type="email"
                className="signup-form-control"
                {...register("email")}
                // required
                // ref={loginEmailRef}
                // name="email"
                // value={emailNameState.email}
                // onChange={onChange}
              ></Form.Control>
            )}
          ></Controller>

          <Form.Label className="signup-label">Password</Form.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="password"
                className="signup-form-control"
                // required
                autoComplete="on"
                {...register("password")}
                // ref={loginPasswordRef}
                // name="password"
                // value={signUpPasswordCompare.password}
                // onChange={onChange}
              ></Form.Control>
            )}
          ></Controller>
          {/* {errorState.login && (
            <div className="signup-error">
              <small className="signup-error-msg">
                Username or password is invalid.
              </small>
            </div>
          )} */}
        </Form.Group>
        <div className="links-container">
          <div
            className="popover-state-link"
            onClick={() => {
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_SIGNUP));
              resetAllExceptShowPopoverStateAndShow();
            }}
          >
            Don't have an account? Sign up.
          </div>
          <div className="signup-popover-button-container">
            {/* onClick={handleLogin} */}
            <button className="create-book-modal-cfm-btn">
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
