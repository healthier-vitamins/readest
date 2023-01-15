// import { Offcanvas } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../components/searchBar/SearchBar";
import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./SearchPage.css";
import SideBar from "../../components/sideBar/sideBar";
// import { toggleOffCanvas } from "../../store/actions/states.action";

function SearchPage() {
  // const { offCanvasState } = useSelector((state) => {
  //   return state.states;
  // });
  // const dispatch = useDispatch();
  

  return (
    <div className="main-container">
      {/* <Offcanvas
        show={offCanvasState}
        onHide={() => {
          dispatch(toggleOffCanvas());
        }} 
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          I will not close if you click outside of me.
        </Offcanvas.Body>
      </Offcanvas> */}
      <div className="sidebar-container">
        <SideBar></SideBar>
      </div>
      <div className="searchbar-container">
        <SearchBar></SearchBar>
      </div>
      <div className="word-definition-container">
        <WordDefinition></WordDefinition>
      </div>
    </div>
  );
}

export default SearchPage;
