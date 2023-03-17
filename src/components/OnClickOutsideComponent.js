import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./OnClickOutsideComponent.scss";

function OnClickOutsideComponent({ onClickOutsideFunc, isShowing, children }) {
  const ref = useRef(null);
  const { createBookModalState, saveWordModalState } = useSelector(
    (state) => state.state
  );
  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    onClickOutsideFunc();
  });

  useEffect(() => {
    if (isShowing && !createBookModalState && !saveWordModalState) {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside && onClickOutside();
        }
      };
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [onClickOutside, isShowing, createBookModalState, saveWordModalState]);

  return <div ref={ref}>{children}</div>;
}

export default OnClickOutsideComponent;
