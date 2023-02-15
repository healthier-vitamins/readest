import { useDispatch } from "react-redux";
import { Fade, Toast } from "react-bootstrap";
import { removeToastNotificationArr } from "../../store/slices/state.slice";
import "./Toaster.scss";

function Toaster({ noti }) {
  const dispatch = useDispatch();
  return (
    noti && (
      <Toast
        // id="toaster"
        onClose={() => {
          dispatch(removeToastNotificationArr());
        }}
        show={!!noti}
        autohide
        animation
        transition={Fade}
        delay={2500}
      >
        <Toast.Body>
          <div className="toast-body-text">{noti}</div>
        </Toast.Body>
      </Toast>
    )
  );
}
export default Toaster;
