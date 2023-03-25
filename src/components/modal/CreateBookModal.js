import { createRef, useState } from "react";
import { Modal, Form, Spinner, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./CreateBookModal.scss";
import { toggleCreateBookModal } from "../../store/slices/state.slice";
import { postBook } from "../../store/slices/book.slice";
import Cookies from "universal-cookie";

function CreateBookModal() {
  const cookies = new Cookies();
  const { createBookModalState } = useSelector((store) => {
    return store.state;
  });
  const [isClicked, setisClicked] = useState(false);
  const { postBookIsLoading } = useSelector((state) => {
    return state.book;
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
      const id = cookies.get("page-id");
      const payload = {
        title: bookTitleRef.current.value,
        id: id,
      };

      dispatch(postBook(payload));
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
            id="form_control"
            // id="form-control"
            isInvalid={isInvalid}
            autoFocus={true}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            <small>Please provide a book a valid title.</small>
          </Form.Control.Feedback>
        </InputGroup>

        <div className="btn-container">
          <button
            className="cfm-btn"
            onClick={(event) => {
              setisClicked(true);
              handleCreateBook(event);
            }}
          >
            {postBookIsLoading && isClicked && !isInvalid ? (
              <Spinner size="sm" className="spinner"></Spinner>
            ) : null}
            Confirm
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              dispatch(toggleCreateBookModal());
              setIsInvalid(false);
              setisClicked(false);
            }}
          >
            <div className="cancel-font">Cancel</div>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateBookModal;
