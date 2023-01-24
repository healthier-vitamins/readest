import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  handleBooksResCheckBoxChange,
  resetBooksResCheckBox,
} from "../../store/slices/books.slice";

import { toggleSaveWordModal } from "../../store/slices/states.slice";
import bookSchema from "../../utils/bookUtil.ts";
import "./SaveWordModal.css";

function SaveWordModal() {
  const { saveWordModalState } = useSelector((state) => state.states);
  const { chosenWordDefinition } = useSelector((state) => state.wordDefinition);
  const { booksRes, booksResCheckbox } = useSelector((state) => state.books);
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
    console.log(booksResCheckbox);
    return (
      <React.Fragment key={String(index)}>
        <div
          className="book-bar"
          onClick={() => dispatch(handleBooksResCheckBoxChange(index))}
        >
          <label className="book-label">
            {book.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text}
          </label>
          <input
            type={"checkbox"}
            checked={booksResCheckbox[index].checked}
            className="book-checkbox"
            // onChange={() => dispatch(handleBooksResCheckBoxChange(index))}
            readOnly
          />
        </div>
      </React.Fragment>
    );
  }

  return (
    <Modal
      centered
      animation={true}
      show={saveWordModalState}
      onHide={() => {
        dispatch(toggleSaveWordModal());
        dispatch(resetBooksResCheckBox());
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
          <div className="list-books-selection">
            {Array.isArray(booksRes.results) && booksRes.results.length > 0
              ? booksRes.results.map((book, index) => {
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
          <div className="save-btn">
            <Link to={"/api/postWord"}>Save</Link>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveWordModal;
