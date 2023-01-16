import { createRef, useState } from "react";
import { Modal, Form, Spinner, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./CreateBookModal.css";
import { toggleCreateBookModal } from "../../store/actions/states.action";
import axios from "axios";

function CreateBookModal() {
  const { createBookModalState } = useSelector((store) => {
    return store.states;
  });
  const [loadSpinner, setLoadSpinner] = useState(false);
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
      setLoadSpinner(true);
      const payload = {
        title: bookTitleRef.current.value,
      };
      await axios.post(`/api/createBook`, payload).finally(() => {
        dispatch(toggleCreateBookModal());
        setLoadSpinner(false);
      });
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
            <small>Please provide a book title.</small>
          </Form.Control.Feedback>
        </InputGroup>

        <div className="btn-container">
          <div
            className="cfm-btn"
            onClick={(event) => {
              handleCreateBook(event);
            }}
          >
            {loadSpinner ? (
              <Spinner size="sm" className="spinner"></Spinner>
            ) : null}
            Confirm
          </div>
          <div
            className="cancel-btn"
            onClick={() => {
              dispatch(toggleCreateBookModal());
              setIsInvalid(false);
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
