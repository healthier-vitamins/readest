import { useEffect, useState } from "react";

function getWindowDimension() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
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
