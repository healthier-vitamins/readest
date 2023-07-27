import { useAppSelector } from "../store/hooks";
import { useCallback, useEffect, useRef } from "react";

function OnClickOutsideComponent({
  onClickOutsideFunc,
  isShowing,
  children,
}: any) {
  const ref: any = useRef(null);
  const { createBookModalState, saveWordModalState } = useAppSelector(
    (state) => state.state
  );

  const onClickOutside = useCallback(() => {
    onClickOutsideFunc();
  }, [onClickOutsideFunc]);

  useEffect(() => {
    if (isShowing && !createBookModalState && !saveWordModalState) {
      const handleClickOutside = (event: any) => {
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
