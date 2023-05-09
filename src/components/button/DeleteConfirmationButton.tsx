import "./DeleteConfirmationButton.scss";

interface Props {
  setConfirmDelete: Function;
  onConfirmDelete: Function;
}

function DeleteConfirmationButton({
  onConfirmDelete,
  setConfirmDelete,
}: Props) {
  return (
    <div className="delete-confirm-container">
      <button className="delete-confirm-cfm-btn">Confirm</button>
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
