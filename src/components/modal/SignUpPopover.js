import { useRef, useState } from "react";
import { Form, Overlay, Popover } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleSignUpPopoverState } from "../../store/slices/state.slice";
import "./SignUpPopover.css";

function SignUpPopover() {
  const { signUpPopoverState } = useSelector((state) => state.state);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const dispatch = useDispatch();

  function handlePopoverClick(event) {
    dispatch(toggleSignUpPopoverState());
    setTarget(event.target);
  }

  return (
    <div ref={ref}>
      <div onClick={handlePopoverClick} className="right-link">
        Sign Up/Login
      </div>
      <Overlay
        show={signUpPopoverState}
        target={target}
        placement="bottom-start"
        container={ref}
        containerPadding={20}
      >
        <Popover>
          {/* <Popover.Header id="popover_header" as="h3">
            Login
          </Popover.Header> */}
          <Popover.Body>
            <div className="popover-container">
              <Form.Group>
                <Form.Label className="signup-label">Username</Form.Label>
                <Form.Control
                  type="text"
                  className="signup-form-control"
                  id="form_control"
                  required
                  // isInvalid={true}
                ></Form.Control>
                <Form.Label className="signup-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  className="signup-form-control"
                  id="form_control"
                  required
                  // isInvalid={true}
                ></Form.Control>
                <div className="signup-error">
                  <small className="signup-error-msg">
                    Username or password is invalid.
                  </small>
                </div>
              </Form.Group>
              <div className="signup-popover-button-container">
                <div className="login-btn">Login</div>
                <div className="cancel-btn">Cancel</div>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default SignUpPopover;
