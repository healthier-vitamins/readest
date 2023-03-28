import { Link } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { HiOutlineUserCircle } from "react-icons/hi";
import SignUpPopover from "../popover/SignUpPopover";
import { userLoggedOut } from "../../store/slices/user.slice";
import React from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/schemas/bookSchema";
import BookSelectionPopover from "../popover/BookSelectionPopover";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import { setBookSelectionPopoverState } from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";

function NavBar() {
  const dispatch = useAppDispatch();
  const { bookSelection } = useAppSelector((state) => state.book);
  const { bookSelectionPopoverState } = useAppSelector(
    (state: any) => state.state
  );

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

  function handleLogout() {
    dispatch(userLoggedOut());
  }

  function clickOutsideHelper() {
    dispatch(setBookSelectionPopoverState(false));
  }

  function onClickOutsideFunc() {
    clickOutsideHelper();
  }

  // helper for selected active tabs
  function activeTabsClass(active: any) {
    if (active) {
      return "selected-active-tab";
    }
  }

  function RenderTabs(obj: any, index: number) {
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
          <div className="books-tab-button">
            <OnClickOutsideComponent
              onClickOutsideFunc={onClickOutsideFunc}
              isShowing={bookSelectionPopoverState}
            >
              <BookSelectionPopover></BookSelectionPopover>
            </OnClickOutsideComponent>
          </div>
        </div>
        <SearchBar></SearchBar>
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
