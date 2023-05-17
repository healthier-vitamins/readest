import { Spinner } from "react-bootstrap";
import "./DeleteConfirmationButton.scss";
import { useState } from "react";

interface Props {
  setConfirmDelete: Function;
  onConfirmDelete: Function;
  isLoading: boolean;
}

function DeleteConfirmationButton({
  onConfirmDelete,
  setConfirmDelete,
  isLoading,
}: Props) {
  const [deleteClicked, setDeleteClicked] = useState(false);

  return (
    <div className="delete-confirm-container">
      <button
        className="delete-confirm-cfm-btn"
        onClick={() => {
          setDeleteClicked(true);
          onConfirmDelete();
        }}
      >
        {isLoading && deleteClicked && (
          <Spinner
            className="delete-confirm-spinner"
            size="sm"
            role="status"
            aria-hidden="true"
          ></Spinner>
        )}
        Confirm
      </button>
      <div className="delete-confirm-vertical-line" />
      <button
        className="delete-confirm-cancel-btn"
        onClick={() => setConfirmDelete(false)}
      >
        Cancel
      </button>
    </div>
  );
}

export default DeleteConfirmationButton;
