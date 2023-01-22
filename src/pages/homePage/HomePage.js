// import { Offcanvas } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.css";
import SideBar from "../../components/sideBar/SideBar";

import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { changeActiveTab } from "../../store/slices/books.slice";

// import { toggleOffCanvas } from "../../store/actions/states.action";

function HomePage() {
  const { bookSelection, selectedBook } = useSelector((state) => {
    return state.books;
  });
  const dispatch = useDispatch();

  function activeTabsLogic(active) {
    if (active) {
      return {
        backgroundColor: "gray",
        borderRadius: "0.375rem 0.375rem 0 0",
        padding: "0",
      };
    }
  }

  function RenderTabs(obj, index) {
    if (obj.bookObj === "Definition") {
      return (
        <React.Fragment key={index}>
          <div
            className="singular-tab"
            onClick={() => {
              dispatch(changeActiveTab(index));
            }}
          >
            <div className="tab-option">{obj.bookObj}</div>
            <div
              className="active-tab-option"
              style={activeTabsLogic(obj.active)}
            ></div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={index}>
        <div
          className="singular-tab"
          onClick={() => {
            dispatch(changeActiveTab(index));
          }}
        >
          <div className="tab-option">
            {obj.bookObj.properties["Book name"].rich_text[0].plain_text}
          </div>
          <div
            className="active-tab-option"
            style={activeTabsLogic(obj.active)}
          ></div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="main-container">
      <div className="sidebar-container">
        <SideBar></SideBar>
      </div>
      <div className="right-container">
        <div className="tabs-selection">
          {bookSelection.map((obj, index) => {
            return RenderTabs(obj, index);
          })}
        </div>
        {selectedBook.bookObj === "Definition" && (
          <WordDefinition></WordDefinition>
        )}
        <div className="ultimate-bottom"></div>
      </div>
    </div>
  );
}

export default HomePage;
