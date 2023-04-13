import { createRef, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import {
  addToastNotificationArr,
  setShowPopoverPage,
  setShowPopoverState,
  toggleShowPopoverState,
} from "../../store/slices/state.slice";
import { userLoggedIn } from "../../store/slices/user.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import "./SignUpPopover.scss";
import { useNavigate } from "react-router-dom";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import { login, userSignUp, verifyUser } from "../../utils/apis/userApis";
import { useAppDispatch, useAppSelector } from "store/hooks";

function SignUpPopover() {
  const navigate = useNavigate();
  const {
    showPopoverState: { state, show },
  } = useAppSelector((state: any) => state.state);
  const [signUpPasswordCompare, setSignUpPasswordCompare] = useState({
    password: "",
    confirmPassword: "",
    isDirty: false,
    isSame: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const emailRef = createRef<HTMLInputElement>();
  const nameRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();
  const confirmPasswordRef = createRef<HTMLInputElement>();
  const loginEmailRef = createRef<HTMLInputElement>();
  const loginPasswordRef = createRef<HTMLInputElement>();

  const dispatch = useAppDispatch();

  interface State {
    [key: string]: boolean;
  }

  const [errorState, setErrorState] = useState<State>({
    signUp: false,
    login: false,
  });
  const [loadingState, setLoadingState] = useState<State>({
    signUp: true,
    confirmEmail: true,
    login: true,
  });

  function resetAllExceptShowPopoverStateAndShow() {
    setSignUpPasswordCompare({
      password: "",
      confirmPassword: "",
      isDirty: false,
      isSame: false,
    });
    setErrorState({
      login: false,
      signUp: false,
    });
    setIsSubmitted(false);
    setLoadingState({
      confirmEmail: true,
      login: true,
      signUp: true,
    });
  }

  function clickOutsideHelper() {
    dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
    dispatch(setShowPopoverState(false));
  }

  function onClickOutsideFunc() {
    resetAllExceptShowPopoverStateAndShow();
    clickOutsideHelper();
  }

  // for redirected email verification URL fragment
  useEffect(() => {
    if (window.location.hash.length > 1) {
      dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_CONFIRM_EMAIL));
      dispatch(setShowPopoverState(true));
      confirmEmailHelper();
    }
    // eslint-disable-next-line
  }, []);

  // the moment error pops up, loadingState and isSubmitted will reset
  useEffect(() => {
    const keys = Object.keys(errorState);
    for (let i = 0; i < keys.length; i++) {
      if (errorState[keys[i]]) {
        loadingState[keys[i]] = true;
        setIsSubmitted(false);
      }
    }
  }, [errorState, loadingState]);

  async function confirmEmailHelper() {
    const token = window.location.hash.substring(
      window.location.hash.indexOf("=") + 1
    );
    const payload = {
      token: token,
    };

    function onError(err: any) {
      setLoadingState({
        ...loadingState,
        confirmEmail: false,
      });

      console.error(err);
      if (err.data === "User not found") {
        dispatch(
          addToastNotificationArr(`${err.data}, perhaps email is in use`)
        );
      } else {
        dispatch(addToastNotificationArr(err.data));
      }
      dispatch(setShowPopoverState(false));
      resetAllExceptShowPopoverStateAndShow();
      navigate(`/`, { replace: true });
    }

    function onSuccess(res: any) {
      setLoadingState({
        ...loadingState,
        confirmEmail: false,
      });
      navigate(`/`, { replace: true });
    }

    verifyUser(onSuccess, onError, payload);
  }

  function handlePopoverClick() {
    dispatch(toggleShowPopoverState());
  }

  async function handleSignUp() {
    if (
      confirmPasswordRef!.current!.value === passwordRef!.current!.value &&
      passwordRef!.current!.value !== ""
    ) {
      setIsSubmitted(true);
      setSignUpPasswordCompare({
        ...signUpPasswordCompare,
        isDirty: true,
        isSame: true,
      });
      const payload = {
        name: nameRef!.current!.value,
        email: emailRef!.current!.value,
        password: passwordRef!.current!.value,
      };
      console.log(payload);

      function onError(err: any) {
        setLoadingState({
          ...loadingState,
          signUp: false,
        });
        setErrorState({
          ...errorState,
          signUp: true,
        });
        setIsSubmitted(false);
        dispatch(addToastNotificationArr(err.data));
      }

      function onSuccess(res: any) {
        setLoadingState({
          ...loadingState,
          signUp: false,
        });
        dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
        resetAllExceptShowPopoverStateAndShow();
        dispatch(
          addToastNotificationArr(`Verification email sent to ${res?.email}`)
        );
      }

      userSignUp(onSuccess, onError, payload);
    } else {
      setSignUpPasswordCompare({
        ...signUpPasswordCompare,
        isSame: false,
        isDirty: true,
      });
      setIsSubmitted(false);
    }
  }

  async function handleLogin() {
    setIsSubmitted(true);
    const payload = {
      email: loginEmailRef!.current!.value,
      password: loginPasswordRef!.current!.value,
    };

    function onError(err: any) {
      setLoadingState({
        ...loadingState,
        login: false,
      });
      setErrorState({
        ...errorState,
        login: true,
      });
      console.log("HERE |||||||||| ", loadingState);
      console.log("HERE |||||||||| ", errorState);
      console.log("HERE |||||||||| ", isSubmitted);
      console.error(err);
      dispatch(addToastNotificationArr(err.data));
    }

    function onSuccess(res: any) {
      const loginPayload = {
        token: res.token.access_token,
        refreshToken: res.token.refresh_token,
        email: res.email,
      };
      dispatch(userLoggedIn(loginPayload));
      setLoadingState({
        ...loadingState,
        login: false,
      });
      dispatch(setShowPopoverState(false));
      resetAllExceptShowPopoverStateAndShow();
    }

    login(onSuccess, onError, payload);
  }

  function handleSignUpPasswordCompare(e: any) {
    console.log(signUpPasswordCompare);
    if (signUpPasswordCompare.isDirty) {
      passwordRef!.current!.value !== confirmPasswordRef!.current!.value
        ? setSignUpPasswordCompare({
            ...signUpPasswordCompare,
            isSame: false,
            password: passwordRef!.current!.value,
            confirmPassword: confirmPasswordRef!.current!.value,
          })
        : setSignUpPasswordCompare({
            ...signUpPasswordCompare,
            isSame: true,
            password: passwordRef!.current!.value,
            confirmPassword: confirmPasswordRef!.current!.value,
          });
    } else {
      const { name, value } = e.target;
      setSignUpPasswordCompare({ ...signUpPasswordCompare, [name]: value });
    }
  }

  function signUpForm() {
    return (
      <div className="popover-box">
        <Form>
          <Form.Group>
            <Form.Label className="signup-label">Name</Form.Label>
            <Form.Control
              type="text"
              className="signup-form-control"
              required
              ref={nameRef}
            ></Form.Control>
            <Form.Label className="signup-label">Email</Form.Label>
            <Form.Control
              type="email"
              className="signup-form-control"
              required
              ref={emailRef}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              ref={passwordRef}
              name="password"
              value={signUpPasswordCompare.password}
              onChange={handleSignUpPasswordCompare}
              isInvalid={
                !signUpPasswordCompare.isSame && signUpPasswordCompare.isDirty
              }
              autoComplete="on"
            ></Form.Control>
            <Form.Label className="signup-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              ref={confirmPasswordRef}
              name="confirmPassword"
              value={signUpPasswordCompare.confirmPassword}
              onChange={handleSignUpPasswordCompare}
              isInvalid={
                !signUpPasswordCompare.isSame && signUpPasswordCompare.isDirty
              }
              autoComplete="on"
            ></Form.Control>
          </Form.Group>
        </Form>
        <div className="links-container">
          {errorState.signUp && signUpPasswordCompare.isDirty && (
            <div className="signup-error-msg">
              Something went wrong, please try again later.
            </div>
          )}
          {!signUpPasswordCompare.isSame && signUpPasswordCompare.isDirty && (
            <div className="signup-error-msg">Passwords do not match.</div>
          )}
          <div
            className="popover-state-link"
            onClick={() => {
              // setPopoverStateHelper(GLOBALVARS.POPOVER_LOGIN);
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
              setIsSubmitted(false);
            }}
          >
            Already have an account? Login.
          </div>
          <div className="signup-popover-button-container">
            <div className="login-btn" onClick={handleSignUp}>
              {loadingState.signUp &&
                signUpPasswordCompare.isDirty &&
                signUpPasswordCompare.isSame &&
                isSubmitted && (
                  <>
                    <Spinner
                      animation="border"
                      id="signup-loading-spinner"
                      size="sm"
                    ></Spinner>
                    &nbsp;
                  </>
                )}
              Sign Up
            </div>
            <div
              className="cancel-btn"
              onClick={() => {
                dispatch(setShowPopoverState(false));
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    );
  }

  function loginForm() {
    return (
      <div className="popover-box">
        <Form>
          <Form.Group>
            <Form.Label className="signup-label">Email</Form.Label>
            <Form.Control
              type="email"
              className="signup-form-control"
              required
              ref={loginEmailRef}
              // isInvalid={true}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              autoComplete="on"
              ref={loginPasswordRef}
              // isInvalid={true}
            ></Form.Control>
            {errorState.login && (
              <div className="signup-error">
                <small className="signup-error-msg">
                  Username or password is invalid.
                </small>
              </div>
            )}
          </Form.Group>
        </Form>
        <div className="links-container">
          <div
            className="popover-state-link"
            onClick={() => {
              // setPopoverStateHelper(GLOBALVARS.POPOVER_SIGNUP);
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_SIGNUP));
              setIsSubmitted(false);
            }}
          >
            Don't have an account? Sign up.
          </div>
          <div className="signup-popover-button-container">
            <div className="login-btn" onClick={handleLogin}>
              {loadingState.login && isSubmitted && (
                <Spinner
                  animation="border"
                  id="signup-loading-spinner"
                  size="sm"
                ></Spinner>
              )}{" "}
              Login
            </div>
            <div
              className="cancel-btn"
              onClick={() => {
                dispatch(setShowPopoverState(false));
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    );
  }

  function emailVerified() {
    if (loadingState.confirmEmail) {
      return (
        <div className="popover-box">
          <Spinner
            animation="border"
            id="confirm-email-loading-spinner"
          ></Spinner>
        </div>
      );
    }

    return (
      <div className="popover-box">
        <div className="confirm-email-textline">
          <div className="verified-text">Email verified! </div>
          <div
            className="_popover-state-link"
            onClick={() =>
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN))
            }
          >
            Please login.
          </div>
        </div>
      </div>
    );
  }

  function buttonClickedStyleMapper() {
    if (show) return { color: "rgb(190, 185, 167)" };
    return {};
  }

  return (
    <OnClickOutsideComponent
      onClickOutsideFunc={!state.emailConfirmState ? onClickOutsideFunc : null}
      isShowing={show}
    >
      <div className="popover-wrapper">
        <div
          onClick={!state.emailConfirmState ? handlePopoverClick : undefined}
          className="right-link"
          style={buttonClickedStyleMapper()}
        >
          Login
        </div>
        {show && (
          <div className="popover-container">
            {state.signUpState
              ? signUpForm()
              : state.loginState
              ? loginForm()
              : state.emailConfirmState
              ? emailVerified()
              : null}
          </div>
        )}
      </div>
    </OnClickOutsideComponent>
  );
}

export default SignUpPopover;
