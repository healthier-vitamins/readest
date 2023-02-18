import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.scss";
import SideNavBar from "../../components/sideNavBar/SideNavBar";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/bookUtil.ts";
// import WordPage from "../wordPage/WordPage";
import GeneralToast from "../../components/toast/GeneralToast";
import WordPage from "../wordPage/WordPage";
import useWindowDimension, {
  setDynamicHeight,
} from "../../utils/useWindowDimension";

function HomePage() {
  const { bookSelection, selectedTab } = useSelector((state) => {
    return state.book;
  });
  const { offCanvasModalState } = useSelector((state) => state.state);
  const dispatch = useDispatch();

  let { width, height } = useWindowDimension();

  function activeTabsClass(active) {
    if (active) {
      return "selected-active-tab";
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
    // change sidebar width based on mobile view
    const sidebarWidth = width < 768 ? 12 : 17;
    // eslint-disable-next-line
    const fullscreenWidth = width / 16;
    const canvasOpenWidth = fullscreenWidth - sidebarWidth;

    if (payload === "sidebar") {
      // ? { width: `${sidebarWidth}rem`, minWidth: `${sidebarWidth}rem` } : { width: "0rem" };
      return offCanvasModalState
        ? {
            transform: "translateX(0)",
            height: setDynamicHeight(height),
          }
        : {
            height: setDynamicHeight(height),
          };
    }
    if (payload === "container") {
      return offCanvasModalState
        ? {
            width: `${canvasOpenWidth}rem`,
            marginLeft: `${sidebarWidth}rem`,
            transition: `width 0.301s, margin-left 0.3s`,
            // height: setDynamicHeight(height),
          }
        : {
            width: `${fullscreenWidth}rem`,
            transition: `margin-left 0.3s`,
            // height: setDynamicHeight(height),
          };
    }
    if (payload === "definition") {
      if (width < 768) {
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
    <div
      className="main-container"
      // style={{ height: setDynamicHeight(height) }}
    >
      <div
        className="sidebar-container"
        style={handleOffCanvasStyle("sidebar")}
      >
        <SideNavBar></SideNavBar>
      </div>
      <div className="right-main-box" style={handleOffCanvasStyle("container")}>
        <div className="tabs-selection">
          {bookSelection.map((obj, index) => RenderTabs(obj, index))}
        </div>
        <div
          className="definition-container"
          style={handleOffCanvasStyle("definition")}
        >
          {selectedTab.bookObj === "Definition" && (
            <WordDefinition></WordDefinition>
          )}
        </div>
        {checkSelectedPageLogic() && selectedTab.bookObj !== "Definition" ? (
          <WordPage></WordPage>
        ) : null}
        <GeneralToast></GeneralToast>
      </div>
    </div>
  );
}

export default HomePage;
