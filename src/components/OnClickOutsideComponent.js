import { useCallback, useEffect, useRef } from "react";
import { store } from "../../src/store/store";
// import { setShowPopoverState } from "../store/slices/state.slice";

function OnClickOutsideComponent({ onClickOutsideFunc, arrOfFunc, children }) {
  const ref = useRef(null);

  const onClickOutside = useCallback(() => {
    // resetAllExceptShowPopoverStateAndShow();
    // dispatch(setShowPopoverPage(globalVars.POPOVER_LOGIN));
    // dispatch(setShowPopoverState(false));
    for (let func of arrOfFunc) {
      //   console.log(func);
      store.dispatch(func);
    }
    onClickOutsideFunc();
  }, []);

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
  }, [onClickOutside, ref]);

  return <div ref={ref}>{children}</div>;
}

export default OnClickOutsideComponent;
