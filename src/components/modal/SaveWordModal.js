import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveWordModal } from "../../store/slices/states.slice";
import "./SaveWordModal.css";

function SaveWordModal() {
  const { saveWordModalState } = useSelector((state) => state.states);
  const { chosenWordDefinition } = useSelector((state) => state.wordDefinition);
  const { listOfBooks } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const [checkState, setcheckState] = useState(
    new Array(listOfBooks.results.length).fill(false)
  );

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

  function handleChange(position) {
    console.log("before ", checkState);
    // const updatedCheckState = checkState.map((ele, index) =>
    //   position === index ? !ele : ele
    // );

    setcheckState([
      ...checkState,
      (checkState[position] = !checkState[position]),
    ]);
    console.log("after  ", checkState);
  }

  function RenderBook(props) {
    const { book, index } = props;
    return (
      <React.Fragment key={String(index)}>
        <div className="book-tab">
          <label className="book-label">
            {book.properties["Book name"].rich_text[0].plain_text}
          </label>
          <input
            type={"checkbox"}
            checked={checkState[index]}
            className="book-checkbox"
            onChange={() => handleChange(index)}
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
            {Array.isArray(listOfBooks.results) &&
            listOfBooks.results.length > 0
              ? listOfBooks.results.map((book, index) => {
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
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveWordModal;
