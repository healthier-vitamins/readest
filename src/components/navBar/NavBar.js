import { Link } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { RxDoubleArrowRight } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import SignUpPopover from "../popover/SignUpPopover";
import { userLoggedOut } from "../../store/slices/user.slice";
import React from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/bookUtil.ts";
import BookSelectionPopover from "../popover/BookSelectionPopover";

function NavBar() {
  const dispatch = useDispatch();
  const { bookSelection } = useSelector((state) => state.book);

  const {
    authentication: { isUserLoggedIn },
  } = useSelector((state) => state.user);

  function handleLogout() {
    dispatch(userLoggedOut());
  }

  // helper for selected active tabs
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
            <div className="tab-option">{obj.bookObj}</div>
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
          <div className="tab-option">
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

  return (
    <div>
      <div className="top-navbar">
        <div className="left-box"></div>
        <Link className="center-link" to={"/"}>
          <span className="title-span">readest</span>
        </Link>
        <div className="right-box">
          {isUserLoggedIn && (
            <>
              <div className="vertical-line"></div>
              <HiOutlineUserCircle className="user-icon"></HiOutlineUserCircle>
            </>
          )}
        </div>
      </div>
      <div className="bottom-navbar">
        <div className="left-box">
          {/* <div className="arrow-head-box">
            {offCanvasModalState ? (
              <RxDoubleArrowRight
                className="arrow-head-icon"
                onClick={handleOffCanvas}
                style={{
                  transition: `transform 0.3s`,
                  transform: `rotate(180deg)`,
                }}
              ></RxDoubleArrowRight>
            ) : (
              <RxDoubleArrowRight
                className="arrow-head-icon"
                onClick={handleOffCanvas}
                style={{
                  transition: `transform 0.3s`,
                  transform: `rotate(360deg)`,
                }}
              ></RxDoubleArrowRight>
            )}
            
          </div> */}
          <div className="books-tab-button">
            <BookSelectionPopover></BookSelectionPopover>
          </div>
        </div>
        <SearchBar className="center-bar"></SearchBar>
        <div className="right-box">
          {!isUserLoggedIn ? (
            <SignUpPopover></SignUpPopover>
          ) : (
            <div className="right-link" onClick={() => handleLogout()}>
              Logout
            </div>
          )}
        </div>
      </div>
      <div className="tabs-selection">
        {bookSelection.map((obj, index) => RenderTabs(obj, index))}
      </div>
    </div>
  );
}

export default NavBar;
