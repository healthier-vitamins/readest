import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Overlay, Popover, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { addToastNotificationArr } from "../../store/slices/state.slice";

import { axiosTo } from "../../utils/promiseUtil";
import useWindowDimension from "../../utils/useWindowDimension";
import "./SignUpPopover.scss";

function SignUpPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [showPopoverState, setShowPopoverState] = useState({
    signUpState: false,
    loginState: true,
    emailConfirmState: false,
  });
  const ref = useRef(null);
  const signUpLinkRef = useRef(null);
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

  const { width } = useWindowDimension();
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
  const cookies = new Cookies();

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

  function setPopoverStateHelper(stateToTurnOn) {
    const keys = Object.keys(showPopoverState);
    const tempObj = {};
    for (let key of keys) {
      if (key === stateToTurnOn) {
        tempObj[key] = true;
      } else {
        tempObj[key] = false;
      }
    }
    setShowPopoverState(tempObj);
  }

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    resetAllExceptShowPopoverStateAndShow();
    setPopoverStateHelper("loginState");
    setShow(false);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  // for redirected email verification URL fragment
  useEffect(() => {
    if (window.location.hash.length > 1) {
      setPopoverStateHelper("emailConfirmState");
      setShow(true);
      setTarget(signUpLinkRef);
      confirmEmailHelper();
    }
    // eslint-disable-next-line
  }, []);

  async function confirmEmailHelper() {
    const token = window.location.hash.substring(
      window.location.hash.indexOf("=") + 1
    );
    // eslint-disable-next-line
    const [err, res] = await axiosTo(
      axios.post("api/confirmEmail", { token: token })
    );
    if (err) {
      setLoadingState({
        ...loadingState,
        confirmEmail: false,
      });

      console.error(err);
      if (err.data === "User not found") {
        dispatch(
          addToastNotificationArr(`${err.data}, perhaps email is in use.`)
        );
      } else {
        dispatch(addToastNotificationArr(err.data));
      }
      setShow(false);
      resetAllExceptShowPopoverStateAndShow();
    }
    setLoadingState({
      ...loadingState,
      confirmEmail: false,
    });
  }

  function handlePopoverClick(event) {
    setShow(!show);
    setTarget(event.target);
  }

  async function handleSignUp() {
    if (confirmPasswordRef.current.value === passwordRef.current.value) {
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

      const [err, res] = await axiosTo(axios.post("/api/signUp", payload));

      if (err) {
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

      if (res) {
        setLoadingState({
          ...loadingState,
          signUp: false,
        });
        setPopoverStateHelper("loginState");
        resetAllExceptShowPopoverStateAndShow();
        dispatch(
          addToastNotificationArr(`Verification email sent to ${res?.email}.`)
        );
      }
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
    const [err, res] = await axiosTo(axios.post("api/login", payload));
    if (err) {
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
    console.log("res baby |||||||||||||||||| ", res);
    cookies.set("access_token", res.token.access_token, {
      maxAge: 3600,
      sameSite: "lax",
      path: "/",
    });
    cookies.set("refresh_token", res.token.refresh_token, {
      maxAge: 3600,
      sameSite: "lax",
      path: "/",
    });
    setLoadingState({
      ...loadingState,
      login: false,
    });
    setShow(false);
    setTarget(signUpLinkRef);
    resetAllExceptShowPopoverStateAndShow();
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
              setPopoverStateHelper("loginState");
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
                  <Spinner
                    animation="border"
                    id="signup-loading-spinner"
                  ></Spinner>
                )}{" "}
              Sign Up
            </div>
            <div className="cancel-btn">Cancel</div>
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
              setPopoverStateHelper("signUpState");
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
            <div className="cancel-btn">Cancel</div>
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
        <div className="verified-text">
          Email verified!{" "}
          <div
            className="_popover-state-link"
            onClick={() => setPopoverStateHelper("loginState")}
          >
            Please login.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <div
        onClick={handlePopoverClick}
        className="right-link"
        ref={signUpLinkRef}
      >
        Sign Up/Login
      </div>
      <Overlay
        show={show}
        target={target}
        placement="bottom-start"
        container={ref}
        containerPadding={width < 300 ? 34 : width < 420 ? 20 : 25}
      >
        <Popover className="popover-container">
          <Popover.Body>
            {showPopoverState.signUpState
              ? signUpForm()
              : showPopoverState.loginState
              ? loginForm()
              : showPopoverState.emailConfirmState
              ? emailVerified()
              : null}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default SignUpPopover;
