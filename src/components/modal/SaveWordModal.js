import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  handlebookResArrCheckboxChange,
  resetbookResArrCheckbox,
} from "../../store/slices/book.slice";
import { toggleSaveWordModal } from "../../store/slices/state.slice";
import { postWordToBook } from "../../store/slices/word.slice";
import { bookSchema } from "../../utils/bookUtil.ts";
import "./SaveWordModal.css";

function SaveWordModal() {
  // const [hasSelectedBook, setHasSelectedBook] = useState(false);
  // const [isSaveClicked, setIsSaveClicked] = useState(false);
  // const [isInvalid, setIsInvalid] = useState(false);
  const { saveWordModalState } = useSelector((state) => state.state);
  const { chosenWordDefinition, isSavingLoading } = useSelector(
    (state) => state.word
  );
  const { bookRes, bookResArrCheckbox } = useSelector((state) => state.book);
  const dispatch = useDispatch();

  function RenderShortDefLogic() {
    const { shortDef } = chosenWordDefinition;
    if (Array.isArray(shortDef)) {
      return shortDef.map((def, index) => {
        return (
          <React.Fragment key={index}>
            <p className="shortdef">
              {++index}.&nbsp;
              {def}
            </p>
          </React.Fragment>
        );
      });
    } else {
      return <p className="shortdef">{shortDef}</p>;
    }
  }

  function RenderBook(props) {
    const { book, index } = props;
    // console.log(bookResArrCheckbox);
    // console.log("book here bitch ||||||||||||||| ", book);
    return (
      <React.Fragment key={String(index)}>
        <div
          className="book-bar"
          onClick={() => {
            dispatch(handlebookResArrCheckboxChange(index));
            // setIsInvalid(false);
            handleSave(book);
          }}
        >
          <label className="book-label">
            {book.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text}
          </label>
          <input
            type={"checkbox"}
            checked={bookResArrCheckbox[index].checked}
            className="book-checkbox"
            readOnly
          />
        </div>
      </React.Fragment>
    );
  }

  function handleSave(book) {
    // const hasSelectedBook = bookResArrCheckbox.some(
    //   (ele) => ele.checked === true
    // );
    // if (hasSelectedBook) {
    // setIsSaveClicked(true);
    // const checkedBookArr = [];
    // bookResArrCheckbox.forEach((bookObj) => {
    //   if (bookObj.checked) {
    //     checkedBookArr.push(bookObj.result.id);
    //   }
    // });
    const payloadObj = {
      // selectedBookArr: checkedBookArr,
      bookObj: book,
      wordDef: chosenWordDefinition,
    };
    dispatch(postWordToBook(payloadObj));
    //   setIsInvalid(false);
    // } else {
    //   setIsInvalid(true);
    // }
  }

  // function handleCancel() {
  //   dispatch(toggleSaveWordModal());
  //   dispatch(resetbookResArrCheckbox());
  //   setIsInvalid(false);
  //   // setHasSelectedBook(false);
  //   setIsSaveClicked(false);
  // }

  // function HandleErrMsg() {
  //   if (isInvalid) {
  //     return (
  //       <div className="err-msg">
  //         <small>*Please select at least one book.</small>
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // }

  return (
    <Modal
      centered
      animation={true}
      show={saveWordModalState}
      onHide={() => {
        dispatch(toggleSaveWordModal());
        dispatch(resetbookResArrCheckbox());
        // setIsInvalid(false);
        // setHasSelectedBook(false);
        // setIsSaveClicked(false);
      }}
    >
      <Modal.Body>
        <div>
          <h5>
            {chosenWordDefinition.title}&nbsp;&nbsp;
            <span>{chosenWordDefinition.abbreviation}</span>
          </h5>
        </div>
        <RenderShortDefLogic></RenderShortDefLogic>
      </Modal.Body>
      <Modal.Footer>
        <div className="list-book-container">
          <div className="list-book-selection">
            {Array.isArray(bookRes.results) && bookRes.results.length > 0
              ? bookRes.results.map((book, index) => {
                  return (
                    <RenderBook
                      book={book}
                      index={index}
                      key={index}
                    ></RenderBook>
                  );
                })
              : null}
          </div>
          {/* <div className="footer-btns"> */}
          {/* <HandleErrMsg></HandleErrMsg>
            <div className="save-word-to-book-btn" onClick={handleSave}>
              {isSavingLoading && isSaveClicked && !isInvalid ? (
                <Spinner size="sm" className="spinner"></Spinner>
              ) : null}
              Save
            </div>
            <div className="cancel-word-to-book-btn" onClick={handleCancel}>
              Cancel
            </div> */}
          {/* </div> */}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveWordModal;
