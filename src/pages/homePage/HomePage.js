// import { Offcanvas } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../components/searchBar/SearchBar";
import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.css";
import SideBar from "../../components/sideBar/SideBar";
import CreateBookModal from "../../components/modal/CreateBookModal";
// import { toggleOffCanvas } from "../../store/actions/states.action";

function SearchPage() {
  return (
    <div className="main-container">
      <div className="sidebar-container">
        <SideBar></SideBar>
      </div>
      <div className="right-container">
        <div className="searchbar-container">
          <SearchBar></SearchBar>
        </div>
        <div className="word-definition-container">
          <WordDefinition></WordDefinition>
        </div>
      </div>
      <CreateBookModal></CreateBookModal>
    </div>
  );
}

export default SearchPage;
