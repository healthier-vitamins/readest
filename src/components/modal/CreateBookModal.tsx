import { Modal } from "react-bootstrap";
import "./CreateBookModal.scss";
import { closeCreateBookModal } from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CreateBookForm from "../forms/CreateBookForm";

function CreateBookModal() {
  const { createBookModalState } = useAppSelector((store) => {
    return store.state;
  });
  const { postBookIsLoading } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();

  return (
    <Modal
      centered
      animation={true}
      show={createBookModalState}
      onHide={() => {
        if (!postBookIsLoading) dispatch(closeCreateBookModal());
      }}
      size="sm"
    >
      <Modal.Body className="modal-container">
        <CreateBookForm />
      </Modal.Body>
    </Modal>
  );
}

export default CreateBookModal;
