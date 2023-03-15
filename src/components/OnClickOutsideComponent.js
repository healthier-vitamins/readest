import { useCallback, useEffect, useRef } from "react";
import "./OnClickOutsideComponent.scss";

function OnClickOutsideComponent({ onClickOutsideFunc, isShowing, children }) {
  const ref = useRef(null);

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    onClickOutsideFunc();
  });

  useEffect(() => {
    if (isShowing) {
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
  }, [onClickOutside, isShowing]);

  return <div ref={ref}>{children}</div>;
}

export default OnClickOutsideComponent;
