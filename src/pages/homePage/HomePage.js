import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.scss";
import React from "react";
import WordPage from "../wordPage/WordPage";
import { useSelector } from "react-redux";

function HomePage() {
  const { bookSelection, selectedTab } = useSelector((state) => state.book);
  // const { offCanvasModalState } = useSelector((state) => state.state);
  // const dispatch = useDispatch();

  // let { width, height } = useWindowDimension();

  // function activeTabsClass(active) {
  //   if (active) {
  //     return "selected-active-tab";
  //   }
  // }

  // function RenderTabs(obj, index) {
  //   if (obj.bookObj === "Definition") {
  //     return (
  //       <React.Fragment key={index}>
  //         <div
  //           className="singular-tab"
  //           onClick={() => {
  //             dispatch(changeActiveTab(index));
  //           }}
  //         >
  //           <div className={`tab-option`}>{obj.bookObj}</div>
  //           <div
  //             className={`active-tab-option ${activeTabsClass(obj.active)}`}
  //           ></div>
  //         </div>
  //       </React.Fragment>
  //     );
  //   }
  //   return (
  //     <React.Fragment key={index}>
  //       <div
  //         className="singular-tab"
  //         onClick={() => {
  //           dispatch(changeActiveTab(index));
  //         }}
  //       >
  //         <div className={`tab-option`}>
  //           {
  //             obj.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0]
  //               .plain_text
  //           }
  //         </div>
  //         <div
  //           className={`active-tab-option ${activeTabsClass(obj.active)}`}
  //         ></div>
  //       </div>
  //     </React.Fragment>
  //   );
  // }

  // function offCanvasStyleMapper(payload) {
  //   // change sidebar width based on mobile view
  //   const sidebarWidth = width <= GLOBALVARS.MOBILE_FOLD_WIDTH ? 12 : 18;
  //   // convert to rem
  //   const fullscreenWidth = width / 16;
  //   const canvasOpenWidth = fullscreenWidth - sidebarWidth;

  //   if (payload === "sidebar") {
  //     return offCanvasModalState
  //       ? {
  //           height: setDynamicHeight(height),
  //           width: `${sidebarWidth}rem`,
  //         }
  //       : {
  //           height: setDynamicHeight(height),
  //         };
  //   }
  //   if (payload === "container") {
  //     return offCanvasModalState
  //       ? {
  //           width: `${canvasOpenWidth}rem`,
  //           marginLeft: `${sidebarWidth}rem`,
  //         }
  //       : {
  //           width: `${fullscreenWidth}rem`,
  //         };
  //   }
  //   // if (payload === "definition") {
  //   //   if (width < MOBILE_MIN_WIDTH) {
  //   //     return offCanvasModalState
  //   //       ? {
  //   //           transform: "translateX(100%)",
  //   //           transition: "transform 0.3s",
  //   //         }
  //   //       : {
  //   //           transform: "translateX(0)",
  //   //           transition: "transform 0.3s",
  //   //         };
  //   //   }
  //   // }
  // }

  // function offCanvasClassMapper(payload) {
  //   switch (payload) {
  //     case "sidebar":
  //       return offCanvasModalState ? "_sidebar" : "";
  //     case "container":
  //       return offCanvasModalState ? "_container-open" : "_container-close";
  //     case "definition":
  //       if (width < GLOBALVARS.MOBILE_MIN_WIDTH) {
  //         return offCanvasModalState ? "_definition-open" : "_definition-close";
  //       }
  //       return "";
  //     default:
  //       return "";
  //   }
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
    <div
      className="main-container"
      // style={{ height: setDynamicHeight(height) }}
    >
      {/* <div
        className={`sidebar-container ${offCanvasClassMapper("sidebar")}`}
        style={offCanvasStyleMapper("sidebar")}
      >
        <SideNavBar></SideNavBar>
      </div> */}
      <div
        // className={`right-main-box ${offCanvasClassMapper("container")}`}
        // style={offCanvasStyleMapper("container")}
        className="right-main-box"
      >
        {/* <div className="tabs-selection">
          {bookSelection.map((obj, index) => RenderTabs(obj, index))}
        </div> */}
        <div
          // className={`definition-container ${offCanvasClassMapper(
          //   "definition"
          // )}`}
          // style={offCanvasStyleMapper("definition")}
          className="definition-container"
        >
          {selectedTab.bookObj === "Definition" && (
            <WordDefinition></WordDefinition>
          )}
          {checkSelectedPageLogic() && selectedTab.bookObj !== "Definition" && (
            <WordPage></WordPage>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
