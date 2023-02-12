import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Overlay, Popover } from "react-bootstrap";
import "./SignUpPopover.css";

function SignUpPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    // setTouched(false);
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

  function handlePopoverClick(event) {
    console.log(show);
    setShow(!show);
    setTarget(event.target);
  }

  function LoginForm() {
    return (
      <>
        <Form>
          <Form.Group>
            <Form.Label className="signup-label">Email</Form.Label>
            <Form.Control
              type="text"
              className="signup-form-control"
              id="_signup_form_control"
              required
              // isInvalid={true}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              id="signup_form_control"
              required
              autoComplete="on"
              // isInvalid={true}
            ></Form.Control>
            <div className="signup-error">
              <small className="signup-error-msg">
                Username or password is invalid.
              </small>
            </div>
          </Form.Group>
        </Form>
        <div className="signup-popover-button-container">
          <div className="login-btn">Login</div>
          <div className="cancel-btn">Cancel</div>
        </div>
      </>
    );
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
        containerPadding={20}
      >
        <Popover className="popover-container">
          <Popover.Body>
            <div className="popover-box">
              <LoginForm></LoginForm>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default SignUpPopover;
