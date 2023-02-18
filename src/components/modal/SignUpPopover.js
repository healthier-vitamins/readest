import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Overlay, Popover, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToastNotificationArr } from "../../store/slices/state.slice";
import { signUp } from "../../store/slices/user.slice";
import { to } from "../../utils/promiseUtil";
import "./SignUpPopover.scss";

function SignUpPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const ref = useRef(null);
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

  const dispatch = useDispatch();
  const { isSignUpLoading } = useSelector((state) => state.user);
  const [isSignUpErr, setIsSignUpErr] = useState(false);

  function resetAllExceptShowSignUpAndShow() {
    setSignUpPasswordCompare({
      password: "",
      confirmPassword: "",
      isDirty: false,
      isSame: false,
    });
    setIsSignUpErr(false);
    setIsSubmitted(false);
  }

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    resetAllExceptShowSignUpAndShow();
    setShowSignUp(false);
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
              type="text"
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
          {isSignUpErr && !!signUpPasswordCompare.isDirty && (
            <div className="signup-error-msg">
              Something went wrong, please try again later.
            </div>
          )}
          {!signUpPasswordCompare.isSame && !!signUpPasswordCompare.isDirty && (
            <div className="signup-error-msg">Passwords do not match.</div>
          )}
          <div
            className="signup-link"
            onClick={() => {
              setShowSignUp(!showSignUp);
              setIsSubmitted(false);
            }}
          >
            Already have an account? Login.
          </div>
          <div className="signup-popover-button-container">
            <div className="login-btn" onClick={handleSignUp}>
              {isSignUpLoading &&
                !!signUpPasswordCompare.isDirty &&
                !!signUpPasswordCompare.isSame &&
                !!isSubmitted && (
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
              type="text"
              className="signup-form-control"
              required
              // isInvalid={true}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              autoComplete="on"
              // isInvalid={true}
            ></Form.Control>
            {/* <div className="signup-error">
                <small className="signup-error-msg">
                  Username or password is invalid.
                </small>
              </div> */}
          </Form.Group>
        </Form>
        <div className="links-container">
          <div
            className="signup-link"
            onClick={() => {
              setShowSignUp(true);
              setIsSubmitted(false);
            }}
          >
            Don't have an account? Sign up.
          </div>
          <div className="signup-popover-button-container">
            <div className="login-btn">Login</div>
            <div className="cancel-btn">Cancel</div>
          </div>
        </div>
      </div>
    );
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
      // eslint-disable-next-line
      const [err, res] = await to(dispatch(signUp(payload)));
      // if sign up fails
      if (err) {
        setSignUpPasswordCompare({
          ...signUpPasswordCompare,
          isDirty: true,
        });
        setIsSignUpErr(true);
        setIsSubmitted(false);
        // once sign up passes
      }
      if (res) {
        setShowSignUp(false);
        resetAllExceptShowSignUpAndShow();
        console.log(res);
        dispatch(
          addToastNotificationArr(
            `Verification email sent to ${res.payload.email}.`
          )
        );
      }

      // const res = await dispatch(signUp(payload));
      // console.log(res?.meta?.requestStatus);
    } else {
      setSignUpPasswordCompare({
        ...signUpPasswordCompare,
        isSame: false,
        isDirty: true,
      });
      setIsSubmitted(false);
    }
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
  
  return (
    <div ref={ref}>
      <div onClick={handlePopoverClick} className="right-link">
        Sign Up/Login
      </div>
      <Overlay
        show={show}
        target={target}
        placement="bottom-start"
        container={ref}
        containerPadding={25}
      >
        <Popover className="popover-container">
          <Popover.Body>{showSignUp ? signUpForm() : loginForm()}</Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default SignUpPopover;
