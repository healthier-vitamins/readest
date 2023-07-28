import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  setShowPopoverPage,
  setShowPopoverState,
  toggleShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import "./SignUpPopover.scss";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import { apiVerifyUser } from "../../store/apis/user.api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import LoginForm from "../forms/LoginForm";
import SignUpForm from "../forms/SignUpForm";

// interface ErrorState {
//   [key: string]: boolean;
// }

function SignUpPopover() {
  const dispatch = useAppDispatch();

  const {
    showPopoverState: { state, show },
  } = useAppSelector((state) => state.state);
  const { isVerifyLoading, isSignUpLoading, isLoginLoading } = useAppSelector(
    (state) => state.user
  );

  const [closePopover, setClosePopover] = useState(false);

  // save form data if popover is closed accidentally
  useEffect(() => {
    if (closePopover) {
      clickOutsideFunc();
      setClosePopover(false);
    }
  }, [closePopover]);

  function clickOutsideFunc() {
    dispatch(setShowPopoverState(false));
  }

  // check if window is entered through url
  // const entries = performance.getEntriesByType("navigation");
  // entries.forEach((entry: PerformanceEntry) => {
  //   console.log(entry);
  //   // @ts-expect-error
  //   if (entry.type === "reload") {
  //     console.log(`${entry.name} was reloaded!`);
  //   }
  // });

  // for redirected email verification URL fragment
  useEffect(() => {
    if (window.location.hash.length > 1) {
      dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_CONFIRM_EMAIL));
      dispatch(setShowPopoverState(true));
      confirmEmailHelper();
    }
  }, []);

  function confirmEmailHelper() {
    const token = window.location.hash.substring(
      window.location.hash.indexOf("=") + 1
    );
    const payload = {
      token: token,
    };
    dispatch(apiVerifyUser(payload));
  }

  function handlePopoverClick() {
    dispatch(toggleShowPopoverState());
  }

  function emailVerified() {
    if (isVerifyLoading) {
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
            onClick={() => {
              dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
            }}
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
      onClickOutsideFunc={() => {
        !state.emailConfirmState &&
        !isVerifyLoading &&
        !isLoginLoading &&
        !isSignUpLoading
          ? setClosePopover(true)
          : null;
      }}
      isShowing={show}
    >
      <div className="popover-wrapper">
        <div
          onClick={!state.emailConfirmState ? handlePopoverClick : undefined}
          className={GLOBALVARS.DEFAULT_LINK_CLASS}
          style={buttonClickedStyleMapper()}
        >
          Login
        </div>
        {show && (
          <div className="popover-container">
            {state.signUpState ? (
              <SignUpForm closePopover={closePopover} />
            ) : state.loginState ? (
              <LoginForm closePopover={closePopover} />
            ) : state.emailConfirmState ? (
              emailVerified()
            ) : null}
          </div>
        )}
      </div>
    </OnClickOutsideComponent>
  );
}

export default SignUpPopover;
