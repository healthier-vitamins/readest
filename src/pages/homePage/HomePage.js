import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.css";
import SideNavBar from "../../components/sideNavBar/SideNavBar";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/bookUtil.ts";
// import WordPage from "../wordPage/WordPage";
import SavedWordToast from "../../components/toast/SavedWordToast";
import WordPage from "../wordPage/WordPage";

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

  function activeTabsClass(active) {
    if (active) {
      return "selected-active-tab";
    }
    // return "";
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
            <div className={`tab-option`}>{obj.bookObj}</div>
            <div
              className={`active-tab-option ${activeTabsClass(obj.active)}`}
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
          <div className={`tab-option`}>
            {
              obj.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0]
                .plain_text
            }
          </div>
          <div
            className={`active-tab-option ${activeTabsClass(obj.active)}`}
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
            transition: `width 0.301s, margin-left 0.3s`,
          }
        : {
            width: `${fullscreenWidth}rem`,
            transition: `margin-left 0.3s`,
          };
    }
    if (payload === "definition") {
      if (windowWidth < 768) {
        return offCanvasModalState
          ? {
              transform: "translateX(100%)",
              transition: "transform 0.3s",
            }
          : {
              transform: "translateX(0)",
              transition: "transform 0.3s",
            };
      }
    }
  }

  // function handleOffCanvasClass(payload) {
  //   if (payload === "definition") {
  //     return offCanvasModalState ? "hidden" : null;
  //   }
  //   if (payload === "mobile-opacity") {
  //     if (windowWidth < 768) {
  //       return offCanvasModalState ? "mobile-hidden" : null;
  //     }
  //   }
  //   if (payload === "mobile-active-opacity") {
  //     if (windowWidth < 768) {
  //       return offCanvasModalState ? "mobile-active-hidden" : null;
  //     }
  //   }
  //   return "";
  // }

  function checkSelectedPageLogic() {
    for (let i = 0; i < bookSelection.length; i++) {
      if (
        JSON.stringify(bookSelection[i].bookObj) ===
        JSON.stringify(selectedTab.bookObj)
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="main-container">
      <div
        className="sidebar-container"
        style={handleOffCanvasStyle("sidebar")}
      >
        <SideNavBar></SideNavBar>
      </div>
      <div
        className={`right-main-box`}
        style={handleOffCanvasStyle("container")}
      >
        <div className={`tabs-selection`}>
          {bookSelection.map((obj, index) => RenderTabs(obj, index))}
        </div>
        <div
          className={`definition-container`}
          style={handleOffCanvasStyle("definition")}
        >
          {selectedTab.bookObj === "Definition" && (
            <WordDefinition></WordDefinition>
          )}
        </div>
        {checkSelectedPageLogic() && selectedTab.bookObj !== "Definition" ? (
          <WordPage></WordPage>
        ) : null}
        <SavedWordToast></SavedWordToast>
      </div>
    </div>
  );
}

export default HomePage;
