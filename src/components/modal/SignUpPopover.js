import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Overlay, Popover, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../store/slices/user.slice";
import "./SignUpPopover.scss";

function SignUpPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const ref = useRef(null);
  // const [signUpFormValue, setSignUpFormValue] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");

  const dispatch = useDispatch();
  const { isSignUpLoading } = useSelector((state) => state.user);

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
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
              // name="name"
              // value={signUpFormValue.name}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Email</Form.Label>
            <Form.Control
              type="text"
              className="signup-form-control"
              required
              ref={emailRef}
              // name="email"
              // value={signUpFormValue.email}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              ref={passwordRef}
              // name="password"
              // value={signUpFormValue.password}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
            ></Form.Control>
          </Form.Group>
        </Form>
        <div className="links-container">
          <div
            className="signup-link"
            onClick={() => {
              setShowSignUp(!showSignUp);
            }}
          >
            Already have an account? Login.
          </div>
          <div className="signup-popover-button-container">
            <div className="login-btn" onClick={handleSignUp}>
              {isSignUpLoading && (
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
    console.log(show);
    setShow(!show);
    setTarget(event.target);
  }

  function handleSignUp() {
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    console.log(payload);
    dispatch(signUp(payload));
  }

  // function handleSignUpOnChange(e) {
  //   // console.log("event |||||||||||||||| ", e);
  //   // console.log("target |||||||||||||||| ", e.target);
  //   const { name, value } = e.target;
  //   setSignUpFormValue({ ...signUpFormValue, [name]: value });
  //   // console.log(signUpFormValue);
  //   // console.log(show);
  // }

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
