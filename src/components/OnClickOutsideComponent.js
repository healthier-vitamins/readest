import { useCallback, useEffect, useRef } from "react";
import "./OnClickOutsideComponent.scss";

function OnClickOutsideComponent({ onClickOutsideFunc, children }) {
  const ref = useRef(null);

  // eslint-disable-next-line
  const onClickOutside = useCallback(() => {
    onClickOutsideFunc();
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

  return <div ref={ref}>{children}</div>;
}

export default OnClickOutsideComponent;
