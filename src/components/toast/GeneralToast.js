import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeToastNotificationArr } from "../../store/slices/state.slice";

import "./GeneralToast.scss";
import Toaster from "./Toaster";

function SavedWordToast() {
  const dispatch = useDispatch();
  const { toastNotificationArr } = useSelector((state) => state.state);
  const [toastAppeared, setToastAppeared] = useState([]);
  useEffect(() => {
    if (toastNotificationArr.length > 0) {
      setToastAppeared(toastNotificationArr);
    }
  }, [toastNotificationArr]);

  function timer() {
    if (toastNotificationArr.length === 1 && toastAppeared.length === 1) {
      setTimeout(() => {
        dispatch(removeToastNotificationArr());
      }, 5500);
      return () => {
        clearTimeout(() => {
          dispatch(removeToastNotificationArr());
        }, 5500);
      };
    }
  }

  return (
    <ToastContainer position="bottom-end" className="saved-word-toast">
      {toastNotificationArr.map((noti, index) => {
        timer();
        return (
          <React.Fragment key={index}>
            <Toaster noti={noti}></Toaster>
          </React.Fragment>
        );
      })}
    </ToastContainer>
  );
}

export default SavedWordToast;
