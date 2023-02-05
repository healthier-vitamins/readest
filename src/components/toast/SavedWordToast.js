import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleIsSavingLoading } from "../../store/slices/word.slice";
import "./SavedWordToast.css";

function SavedWordToast() {
  const dispatch = useDispatch();
  const { isSavingLoading } = useSelector((state) => state.word);

  return (
    <React.Fragment>
      <ToastContainer position="bottom-end">
        <Toast
          className="saved-word-toast"
          onClose={() => dispatch(toggleIsSavingLoading())}
          show={!isSavingLoading}
          delay={3000}
          autohide
        >
          <Toast.Body>Word added.</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
}

export default SavedWordToast;
