import { createRef, useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Form, Spinner, InputGroup } from "react-bootstrap";
import "./CreateBookModal.scss";
// @ts-ignore
import { toggleCreateBookModal } from "../../store/slices/state.slice";
// @ts-ignore
import { postBook } from "../../store/slices/book.slice";
import Cookies from "universal-cookie";
import { useAppDispatch, useAppSelector } from "store/hooks";

function CreateBookModal() {
  const cookies = useMemo(() => {
    return new Cookies();
  }, []);

  const { createBookModalState } = useAppSelector((store: any) => {
    return store.state;
  });
  const [isClicked, setisClicked] = useState(false);
  const { postBookIsLoading } = useAppSelector((state) => {
    return state.book;
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const dispatch = useAppDispatch();
  const bookTitleRef = createRef<HTMLInputElement>();

  const handleCreateBook = useCallback(async () => {
    const specialSymbolsRegex = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;

    if (
      bookTitleRef.current!.value === "" ||
      bookTitleRef.current!.value.startsWith(" ") ||
      specialSymbolsRegex.test(bookTitleRef.current!.value)
    ) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      const id = cookies.get("user-id");
      const payload = {
        title: bookTitleRef.current!.value,
        id: id,
      };

      dispatch(postBook(payload));
    }
  }, [bookTitleRef, cookies, dispatch]);

  useEffect(() => {
    if (createBookModalState) {
      function handleEnter(e: KeyboardEvent) {
        if (e.key === "Enter") {
          setisClicked(true);
          handleCreateBook();
        }
      }

      window.addEventListener("keyup", handleEnter);
      return () => {
        window.removeEventListener("keyup", handleEnter);
      };
    }
  }, [createBookModalState, handleCreateBook]);

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
      size="sm"
    >
      <Modal.Body className="modal-container">
        <InputGroup className="input-group" hasValidation>
          <Form.Control
            type="text"
            placeholder="Enter book name"
            ref={bookTitleRef}
            required
            className="create-book-modal-form-control"
            id="form_control"
            // id="form-control"
            isInvalid={isInvalid}
            autoFocus={true}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            <small>
              Book title should not be empty or contain special symbols.
            </small>
          </Form.Control.Feedback>
        </InputGroup>

        <div className="create-book-modal-btn-container">
          <button
            className="create-book-modal-cfm-btn"
            onClick={(e) => {
              setisClicked(true);
              handleCreateBook();
            }}
          >
            {postBookIsLoading && isClicked && !isInvalid ? (
              <Spinner size="sm" className="spinner"></Spinner>
            ) : null}
            Confirm
          </button>
          <button
            className="create-book-modal-cancel-btn"
            onClick={() => {
              dispatch(toggleCreateBookModal());
              setIsInvalid(false);
              setisClicked(false);
            }}
          >
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateBookModal;
