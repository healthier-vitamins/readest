import { GLOBALVARS } from "./GLOBALVARS";
import { useEffect, useState } from "react";

function getWindowDimension() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function setDynamicHeight(height: number) {
  // minus off the navbar
  return (height -= GLOBALVARS.NAVBAR_HEIGHT);
}

export default function useWindowDimension() {
  const [windowDimension, setWindowDimensions] = useState(getWindowDimension());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimension;
}

export { setDynamicHeight };
