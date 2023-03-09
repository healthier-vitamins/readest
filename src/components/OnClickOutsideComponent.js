// import useWindowDimension from "../utils/useWindowDimension.ts";
import "./OnClickOutsideComponent.scss";

function OnClickOutsideComponent({ onClickOutsideFunc, children }) {
  // const { height, width } = useWindowDimension();

  return (
    <div>
      {/* className="outside-overlay" style={{ width: width, height: height }} */}
      {children}
    </div>
  );
}

export default OnClickOutsideComponent;
