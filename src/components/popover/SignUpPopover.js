import React, { useEffect, useRef, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addToastNotificationArr,
  setShowPopoverPage,
  setShowPopoverState,
  toggleShowPopoverState,
} from "../../store/slices/state.slice";
import { userLoggedIn } from "../../store/slices/user.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS.ts";
import "./SignUpPopover.scss";
import { useNavigate } from "react-router-dom";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import { login, userSignUp, verifyUser } from "../../utils/userApis.ts";

function SignUpPopover() {
  const navigate = useNavigate();
  const {
    showPopoverState: { state, show },
  } = useSelector((state) => state.state);
  const [signUpPasswordCompare, setSignUpPasswordCompare] = useState({
    password: "",
    confirmPassword: "",
    isDirty: false,
    isSame: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const loginEmailRef = useRef("");
  const loginPasswordRef = useRef("");

  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState({
    signUpErr: false,
    loginErr: false,
  });
  const [loadingState, setLoadingState] = useState({
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
      loginErr: false,
      signUpErr: false,
    });
    setIsSubmitted(false);
    setLoadingState({
      confirmEmail: true,
      login: true,
      signUp: true,
    });
  }

  function clickOutsideHelper() {
    // dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
    dispatch(setShowPopoverState(false));
  }

  function onClickOutsideFunc() {
    // resetAllExceptShowPopoverStateAndShow();
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

  async function confirmEmailHelper() {
    const token = window.location.hash.substring(
      window.location.hash.indexOf("=") + 1
    );
    const payload = {
      token: token,
    };

    function errFuncs(err) {
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

    function successFuncs(res) {
      setLoadingState({
        ...loadingState,
        confirmEmail: false,
      });
      navigate(`/`, { replace: true });
    }

    verifyUser(successFuncs, errFuncs, payload);
  }

  function handlePopoverClick(event) {
    dispatch(toggleShowPopoverState());
  }

  async function handleSignUp() {
    if (
      confirmPasswordRef.current.value === passwordRef.current.value &&
      passwordRef.current.value !== ""
    ) {
      setIsSubmitted(true);
      setSignUpPasswordCompare({
        ...signUpPasswordCompare,
        isDirty: true,
        isSame: true,
      });
      const payload = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      console.log(payload);

      // const [err, res] = await axiosTo(axios.post("/api/signUp", payload));

      function errFuncs(err) {
        setLoadingState({
          ...loadingState,
          signUp: false,
        });
        setErrorState({
          ...errorState,
          signUpErr: true,
        });
        setIsSubmitted(false);
        dispatch(addToastNotificationArr(err.data));
      }

      function successFuncs(res) {
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

      userSignUp(successFuncs, errFuncs, payload);

      // if (err) {
      //   setLoadingState({
      //     ...loadingState,
      //     signUp: false,
      //   });
      //   setErrorState({
      //     ...errorState,
      //     signUpErr: true,
      //   });
      //   setIsSubmitted(false);
      //   dispatch(addToastNotificationArr(err.data));
      // }

      // if (res) {
      //   setLoadingState({
      //     ...loadingState,
      //     signUp: false,
      //   });
      //   dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
      //   resetAllExceptShowPopoverStateAndShow();
      //   dispatch(
      //     addToastNotificationArr(`Verification email sent to ${res?.email}`)
      //   );
      // }
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
    console.log("is submited before login ??????????????????? ", isSubmitted);
    setIsSubmitted(true);
    const payload = {
      email: loginEmailRef.current.value,
      password: loginPasswordRef.current.value,
    };

    function errFuncs(err) {
      setLoadingState({
        ...loadingState,
        login: false,
      });
      setErrorState({
        ...errorState,
        loginErr: true,
      });
      console.error(err);
      dispatch(addToastNotificationArr(err.data));
    }

    function successFuncs(res) {
      console.log("res baby |||||||||||||||||| ", res);

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

    login(successFuncs, errFuncs, payload);
  }

  function handleSignUpPasswordCompare(e) {
    console.log(signUpPasswordCompare);
    console.log(passwordRef.current.value, confirmPasswordRef.current.value);
    if (signUpPasswordCompare.isDirty) {
      passwordRef.current.value !== confirmPasswordRef.current.value
        ? setSignUpPasswordCompare({
            ...signUpPasswordCompare,
            isSame: false,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value,
          })
        : setSignUpPasswordCompare({
            ...signUpPasswordCompare,
            isSame: true,
            password: passwordRef.current.value,
            confirmPassword: confirmPasswordRef.current.value,
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
          {errorState.signUpErr && signUpPasswordCompare.isDirty && (
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
            {errorState.loginErr && isSubmitted && (
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
      onClickOutsideFunc={onClickOutsideFunc}
      isShowing={show}
    >
      <div className="popover-wrapper">
        <div
          onClick={handlePopoverClick}
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
