import "./SideBar.css";
import { FiPlusSquare } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toggleCreateBookModal } from "../../store/actions/states.action";

function SideBar() {
  const dispatch = useDispatch();
  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }

  return (
    <div className="sidebar-container">
      <div className="add-book-btn" onClick={handleCreateBook}>
        <FiPlusSquare />
      </div>
    </div>
  );
}

export default SideBar;
