import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.css";
import SideBar from "../../components/sideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/bookUtil.ts";

function HomePage() {
  const { bookSelection, selectedTab } = useSelector((state) => {
    return state.book;
  });
  const { offCanvasModalState } = useSelector((state) => state.state);
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", onResizeInstant());
    return () => window.removeEventListener("resize", onResizeInstant());
    // eslint-disable-next-line
  }, [window.innerWidth]);

  function onResizeInstant() {
    setWindowWidth(window.innerWidth);
    window.setTimeout(setWindowWidth(window.innerWidth), 5);
    return () => window.clearTimeout(setWindowWidth(window.innerWidth), 5);
  }

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
            <div
              className={`tab-option ${handleOffCanvasClass("mobile-opacity")}`}
            >
              {obj.bookObj}
            </div>
            <div
              className={`active-tab-option ${handleOffCanvasClass(
                "mobile-active-opacity"
              )}`}
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
          <div
            className={`tab-option ${handleOffCanvasClass("mobile-opacity")}`}
          >
            {
              obj.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0]
                .plain_text
            }
          </div>
          <div
            className={`active-tab-option ${handleOffCanvasClass(
              "mobile-active-opacity"
            )}`}
            style={activeTabsLogic(obj.active)}
          ></div>
        </div>
      </React.Fragment>
    );
  }
  function handleOffCanvasStyle(payload) {
    const sidebarWidth = windowWidth < 768 ? 12 : 17;
    // eslint-disable-next-line no-restricted-globals
    const fullscreenWidth = windowWidth / 16;
    const canvasOpenWidth = fullscreenWidth - sidebarWidth;

    if (payload === "sidebar") {
      // ? { width: `${sidebarWidth}rem`, minWidth: `${sidebarWidth}rem` } : { width: "0rem" };
      return offCanvasModalState ? { transform: "translateX(0)" } : {};
    }
    if (payload === "container") {
      return offCanvasModalState
        ? {
            width: `${canvasOpenWidth}rem`,
            marginLeft: `${sidebarWidth}rem`,
            transition: `width 0.5s, margin-left 0.4s`,
          }
        : {
            width: `${fullscreenWidth}rem`,
            transition: `margin-left 0.4s`,
          };
    }
    if (payload === "definition") {
      if (windowWidth < 768) {
        return offCanvasModalState
          ? {
              transform: "translateX(100%)",
              opacity: "0%",
              transition: "opacity 0.25s, transform 0.4s",
            }
          : {
              transform: "translateX(0)",
              opacity: "1",
              transition: "opacity 0.6s, transform 0.6s",
            };
      }
    }
  }

  function handleOffCanvasClass(payload) {
    if (payload === "definition") {
      return offCanvasModalState ? "hidden" : null;
    }
    if (payload === "mobile-opacity") {
      if (windowWidth < 768) {
        return offCanvasModalState ? "mobile-hidden" : null;
      }
    }
    if (payload === "mobile-active-opacity") {
      if (windowWidth < 768) {
        return offCanvasModalState ? "mobile-active-hidden" : null;
      }
    }
  }

  return (
    <div className="main-container">
      <div
        className="sidebar-container"
        style={handleOffCanvasStyle("sidebar")}
      >
        <SideBar></SideBar>
      </div>
      <div
        className={`right-main-box ${handleOffCanvasClass("mobile-opacity")}`}
        style={handleOffCanvasStyle("container")}
      >
        <div
          className={`tabs-selection ${handleOffCanvasClass("mobile-opacity")}`}
        >
          {bookSelection.map((obj, index) => {
            return RenderTabs(obj, index);
          })}
        </div>
        <div
          className={`definition-container ${handleOffCanvasClass(
            "definition"
          )}`}
          style={handleOffCanvasStyle("definition")}
        >
          {selectedTab.bookObj === "Definition" && (
            <WordDefinition></WordDefinition>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
