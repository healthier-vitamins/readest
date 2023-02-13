import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form, Overlay, Popover } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/slices/user.slice";
import "./SignUpPopover.scss";

function SignUpPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const ref = useRef(null);
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const signUpFormRef = createRef();
  const dispatch = useDispatch();
  // const { isSignUpLoading } = useSelector((state) => state.user);

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
        <div className="divider"></div>
        <div className="signup-popover-button-container">
          <div
            className="signup-link"
            onClick={() => {
              setShowSignUp(true);
            }}
          >
            Sign Up
          </div>
          <div className="login-btn">Login</div>
          <div className="cancel-btn">Cancel</div>
        </div>
      </>
    );
  }

  function handleSignUp() {
    const payload = signUpFormRef.current.value;
    console.log("payload being sent ||||||||||||||||||| ", payload);
    dispatch(signUp(payload));
  }

  function handleSignUpOnChange(e) {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
    console.log(signUpForm);
    console.log(show);
  }
  function SignUpForm() {
    return (
      <>
        <Form>
          <Form.Group>
            <Form.Label className="signup-label">Name</Form.Label>
            <Form.Control
              type="text"
              className="signup-form-control"
              required
              ref={signUpFormRef}
              // name="name"
              // value={signUpForm.name}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Email</Form.Label>
            <Form.Control
              type="text"
              className="signup-form-control"
              required
              // ref={signUpFormRef.current.email}
              // name="email"
              // value={signUpForm.email}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
              // ref={signUpFormRef.current.password}
              // name="password"
              // value={signUpForm.password}
              // onChange={handleSignUpOnChange}
            ></Form.Control>
            <Form.Label className="signup-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              className="signup-form-control"
              required
            ></Form.Control>
            <div className="signup-popover-button-container">
              <div
                className="signup-link"
                onClick={() => {
                  setShowSignUp(!showSignUp);
                }}
              >
                Login
              </div>
              <div className="login-btn" onClick={handleSignUp}>
                {/* {isSignUpLoading && <Spinner animation="border"></Spinner>} Sign
                Up */}
                Sign Up
              </div>
              <div className="cancel-btn">Cancel</div>
            </div>
          </Form.Group>
        </Form>
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
              {showSignUp ? <SignUpForm></SignUpForm> : <LoginForm></LoginForm>}
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default SignUpPopover;
