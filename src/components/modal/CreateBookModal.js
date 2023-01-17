import { createRef, useState } from "react";
import { Modal, Form, Spinner, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./CreateBookModal.css";
import { toggleCreateBookModal } from "../../store/slices/states.slice";
import { postBook } from "../../store/slices/books.slice";

function CreateBookModal() {
  const { createBookModalState } = useSelector((store) => {
    return store.states;
  });
  const [isClicked, setisClicked] = useState(false);
  const { isLoading } = useSelector((state) => {
    return state.books;
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const dispatch = useDispatch();
  const bookTitleRef = createRef();

  async function handleCreateBook() {
    if (
      bookTitleRef.current.value === "" ||
      bookTitleRef.current.value.startsWith(" ")
    ) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      const bookDeets = {
        title: bookTitleRef.current.value,
      };
      dispatch(postBook(bookDeets));
    }
  }

  return (
    <Modal
      centered
      animation={true}
      show={createBookModalState}
      onHide={() => {
        dispatch(toggleCreateBookModal());
        setIsInvalid(false);
        setisClicked(false);
      }}
    >
      <Modal.Body className="modal-container">
        <InputGroup className="input-group" hasValidation>
          <Form.Control
            type="text"
            placeholder="Enter book name"
            ref={bookTitleRef}
            required
            className="form-control"
            isInvalid={isInvalid}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            <small>Please provide a book a valid title.</small>
          </Form.Control.Feedback>
        </InputGroup>

        <div className="btn-container">
          <div
            className="cfm-btn"
            onClick={(event) => {
              setisClicked(true);
              handleCreateBook(event);
            }}
          >
            {isLoading && isClicked && !isInvalid ? (
              <Spinner size="sm" className="spinner"></Spinner>
            ) : null}
            Confirm
          </div>
          <div
            className="cancel-btn"
            onClick={() => {
              dispatch(toggleCreateBookModal());
              setIsInvalid(false);
              setisClicked(false);
            }}
          >
            Cancel
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateBookModal;
