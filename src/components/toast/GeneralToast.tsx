import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { removeToastNotificationArr } from "../../store/slices/state.slice";

import "./GeneralToast.scss";
import Toaster from "./Toaster";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function SavedWordToast() {
  const dispatch = useAppDispatch();
  const { toastNotificationArr } = useAppSelector((state: any) => state.state);
  const [toastAppeared, setToastAppeared] = useState([]);
  useEffect(() => {
    if (toastNotificationArr.length > 0) {
      setToastAppeared(toastNotificationArr);
    }
  }, [toastNotificationArr]);

  function timer() {
    if (toastNotificationArr.length === 1 && toastAppeared.length === 1) {
      const timeoutId = setTimeout(() => {
        dispatch(removeToastNotificationArr());
      }, 10000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }

  return (
    <ToastContainer position="bottom-end" className="saved-word-toast">
      {toastNotificationArr.map((noti: string, index: number) => {
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
