import { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  setShowPopoverPage,
  setShowPopoverState,
  toggleShowPopoverState,
} from "../../store/slices/state.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import "./SignUpPopover.scss";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import {
  apiLogin,
  apiUserSignUp,
  apiVerifyUser,
} from "../../store/apis/user.api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import LoginForm from "../forms/LoginForm";
import SignUpForm from "../forms/SignUpForm";
import { getAllBook } from "../../store/apis/book.api";

// interface ErrorState {
//   [key: string]: boolean;
// }

interface HandleLoginParams {
  email: string;
  password: string;
}
export type HandleLoginFn = (params: HandleLoginParams) => Promise<void>;

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export type SignUpFn = (params: SignUpParams) => Promise<void>;

function SignUpPopover() {
  const dispatch = useAppDispatch();

  const {
    showPopoverState: { state, show },
  } = useAppSelector((state) => state.state);
  const { verifyState } = useAppSelector((state) => state.user);

  const [triggerLogin, setTriggerLogin] = useState(false);
  const [triggerSignUp, setTriggerSignUp] = useState(false);
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

  const handleSignUp: SignUpFn = useCallback(async (formData) => {
    await dispatch(apiUserSignUp(formData));
  }, []);

  const handleLogin: HandleLoginFn = useCallback(
    async (formData: { email: string; password: string }) => {
      const res = await dispatch(apiLogin(formData));
      console.log("🚀 ~ file: SignUpPopover.tsx:102 ~ res:", res);
      if (res.type.includes("fulfilled")) dispatch(getAllBook(res.payload.id));
    },
    [dispatch]
  );

  // event listener for "Enter" key only on login and signUp forms
  useEffect(() => {
    if (show) {
      function handleEnter(e: KeyboardEvent) {
        if (e.key === "Enter") {
          if (state.loginState) {
            setTriggerLogin(true);
          } else if (state.signUpState) {
            setTriggerSignUp(true);
          }
        }
      }

      window.addEventListener("keyup", handleEnter);
      return () => {
        window.removeEventListener("keyup", handleEnter);
      };
    }
  }, [handleLogin, handleSignUp, state.loginState, state.signUpState, show]);

  function emailVerified() {
    if (verifyState.isVerifyLoading) {
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
        !state.emailConfirmState ? setClosePopover(true) : null;
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
              <SignUpForm
                handleSignUp={handleSignUp}
                setTriggerSignUp={setTriggerSignUp}
                triggerSignUp={triggerSignUp}
                closePopover={closePopover}
              />
            ) : state.loginState ? (
              <LoginForm
                handleLogin={handleLogin}
                triggerLogin={triggerLogin}
                setTriggerLogin={setTriggerLogin}
                closePopover={closePopover}
              />
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
