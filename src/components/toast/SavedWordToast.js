import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeSavingWordToast } from "../../store/slices/state.slice";

import "./SavedWordToast.css";

function SavedWordToast() {
  const dispatch = useDispatch();
  const { savingWordToast } = useSelector((state) => state.state);
  const [toastAppeared, setToastAppeared] = useState([]);
  useEffect(() => {
    if (savingWordToast.length > 0) {
      setToastAppeared(savingWordToast);
    }
  }, [savingWordToast]);

  //   function RenderToast(book) {
  //     return (
  //       <Toast
  //         className="saved-word-toast"
  //         onClose={() => dispatch(removeSavingWordToast())}
  //         show={!!book}
  //         delay={3000}
  //         autohide
  //       >
  //         <Toast.Body>Word added to {book}</Toast.Body>
  //       </Toast>
  //     );
  //   }

  function timer() {
    if (savingWordToast.length === 1 && toastAppeared.length === 1) {
      setTimeout(() => {
        dispatch(removeSavingWordToast());
      }, 5500);
      return () => {
        clearTimeout(() => {
          dispatch(removeSavingWordToast());
        }, 5500);
      };
    }
  }

  return (
    <ToastContainer position="bottom-end" className="saved-word-toast">
      {savingWordToast.map((book) => {
        timer();
        return (
          <Toast
            animation={true}
            onClose={() => {
              dispatch(removeSavingWordToast());
              //   const temp = [];
              //   console.log(
              //     "BEFORE? |||||||||||||||||||||||||||||||||||||| ",
              //     toastAppeared
              //   );
              //   for (let i = 0; i < toastAppeared.length - 1; i++) {
              //     temp.push(toastAppeared[i]);
              //   }
              //   console.log(
              //     "TEMP  ||||||||||||||||||||||||||||||||||||||||||| ",
              //     temp
              //   );
              //   setToastAppeared(temp);
            }}
            show={!!book}
            delay={2500}
            autohide
          >
            <Toast.Body>Word added to {book}</Toast.Body>
          </Toast>
        );
      })}
    </ToastContainer>
  );
}

export default SavedWordToast;
