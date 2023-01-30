import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.css";
import SideBar from "../../components/sideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/bookUtil.ts";

function HomePage() {
  const { bookSelection, selectedBook } = useSelector((state) => {
    return state.book;
  });
  const { offCanvasModalState } = useSelector((state) => state.state);
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
            {
              obj.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0]
                .plain_text
            }
          </div>
          <div
            className="active-tab-option"
            style={activeTabsLogic(obj.active)}
          ></div>
        </div>
      </React.Fragment>
    );
  }
  function handleOffCanvasLogic(payload) {
    const sidebarWidth = 17;
    // eslint-disable-next-line no-restricted-globals
    const fullscreenWidth = screen.width / 16;
    const canvasOpenWidth = fullscreenWidth - sidebarWidth;

    if (payload === "sidebar") {
      return offCanvasModalState
        ? // ? { width: `${sidebarWidth}rem`, minWidth: `${sidebarWidth}rem` }
          // : { width: "0rem" };
          { transform: "translateX(0)" }
        : {};
    }
    if (payload === "container") {
      return offCanvasModalState
        ? {
            width: `${canvasOpenWidth}rem`,
            marginLeft: `${sidebarWidth}rem`,
            transition: `width 0.7s, margin-left 0.6s`,
          }
        : { width: `${fullscreenWidth}rem`, transition: `margin-left 0.6s` };
    }
  }

  return (
    <div className="main-container">
      <div
        className="sidebar-container"
        style={handleOffCanvasLogic("sidebar")}
      >
        <SideBar></SideBar>
      </div>
      <div className="right-main-box" style={handleOffCanvasLogic("container")}>
        <div className="tabs-selection">
          {bookSelection.map((obj, index) => {
            return RenderTabs(obj, index);
          })}
        </div>
        {selectedBook.bookObj === "Definition" && (
          <WordDefinition></WordDefinition>
        )}
      </div>
    </div>
  );
}

export default HomePage;
