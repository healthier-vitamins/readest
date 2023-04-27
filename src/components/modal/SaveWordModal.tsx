import React from "react";
import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  handlebookResArrCheckboxChange,
  resetbookResArrCheckbox,
} from "../../store/slices/book.slice";
import { toggleSaveWordModal } from "../../store/slices/state.slice";
import { postWordToBook } from "../../store/slices/word.slice";
import "./SaveWordModal.scss";

function SaveWordModal() {
  // const [hasSelectedBook, setHasSelectedBook] = useState(false);
  // const [isSaveClicked, setIsSaveClicked] = useState(false);
  // const [isInvalid, setIsInvalid] = useState(false);
  const { saveWordModalState } = useAppSelector((state: any) => state.state);
  const { chosenWordDefinition } = useAppSelector((state) => state.word);
  const { bookRes, bookResArrCheckbox } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();

  function renderShortDefLogic(): React.ReactElement[] | React.ReactElement {
    const { shortDef } = chosenWordDefinition;
    if (Array.isArray(shortDef)) {
      return shortDef.map((def, index) => {
        // if (typeof def === "object") {
        //   return (
        //     <React.Fragment key={index}>
        //       <p className="shortdef">{shortDef[0].cxl}</p>
        //       {shortDef[0]?.cxtis &&
        //         shortDef[0].cxtis.map((word: any, index: number) => {
        //           return (
        //             <React.Fragment key={index}>
        //               <p className="shortdef">
        //                 {++index}.&nbsp;{word.cxt}
        //               </p>
        //               <br />
        //             </React.Fragment>
        //           );
        //         })}
        //     </React.Fragment>
        //   );
        // } else {
        return (
          <React.Fragment key={index}>
            <p className="shortdef">
              {++index}.&nbsp;
              {def}
            </p>
          </React.Fragment>
        );
        // }
      });
    } else {
      return (
        <React.Fragment>
          <p className="shortdef">{shortDef}</p>
        </React.Fragment>
      );
    }
  }

  function RenderBook(props: any) {
    const { book, index } = props;
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
            {/* {book.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text} */}
            {book.bookName}
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

  function handleSave(book: any) {
    // TODO books cannot contain special characters
    const payloadObj = {
      bookObj: book,
      wordDef: chosenWordDefinition,
    };
    dispatch(postWordToBook(payloadObj));
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
        {renderShortDefLogic()}
      </Modal.Body>
      <Modal.Footer>
        <div className="list-book-container">
          <div className="list-book-selection">
            {Array.isArray(bookRes) && bookRes.length > 0
              ? bookRes.map((book: any, index: number) => {
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
