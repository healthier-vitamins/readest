import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
// import {
//   setShowPopoverPage,
//   setShowPopoverState,
// } from "../store/slices/state.slice";
// import { globalVars } from "../../src/utils/globalVars";

function OnClickOutsideComponent({ onClickOutsideFunc, children }) {
  //   const dispatch = useDispatch();
  const ref = useRef(null);

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    onClickOutsideFunc();
    // dispatch(setShowPopoverPage(globalVars.POPOVER_LOGIN));
    // dispatch(setShowPopoverState(false));
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
  }, [onClickOutside, ref]);

  return <div ref={ref}>{children}</div>;
}

export default OnClickOutsideComponent;
