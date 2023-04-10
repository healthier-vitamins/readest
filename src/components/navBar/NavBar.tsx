import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { HiOutlineUserCircle } from "react-icons/hi";
import SignUpPopover from "../popover/SignUpPopover";
import React from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import { bookSchema } from "../../utils/schemas/bookSchema";
import BookSelectionPopover from "../popover/BookSelectionPopover";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import { setBookSelectionPopoverState } from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { logout } from "utils/apis/userApis";

function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bookSelection } = useAppSelector((state) => state.book);
  const { bookSelectionPopoverState } = useAppSelector(
    (state: any) => state.state
  );

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

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
    console.log("obj here |||||| ", obj);
    if (obj.bookObj.bookName === "Definition") {
      return (
        <React.Fragment key={index}>
          <div
            className="singular-tab"
            onClick={() => {
              // TODO HERE URL
              dispatch(changeActiveTab(index));
              // eslint-disable-next-line
              if (obj.bookObj.id == 0) {
                navigate("/");
              } else {
                navigate(`/book/${obj.bookObj.bookName}--${obj.bookObj.id}`);
              }
            }}
          >
            <div className="tab-option">{obj.bookObj.bookName}</div>
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
            // eslint-disable-next-line
            if (obj.bookObj.id == 0) {
              navigate("/");
            } else {
              navigate(`/book/${obj.bookObj.bookName}--${obj.bookObj.id}`);
            }
          }}
        >
          <div className="tab-option">
            {/* {
              obj.bookObj.properties[bookSchema.BOOK_NAME].rich_text[0]
                .plain_text
            } */}
            {obj.bookObj.bookName}
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
            <div className="right-link" onClick={() => logout()}>
              Logout
            </div>
          )}
        </div>
      </div>
      <div className="tabs-selection">
        {bookSelection.map((obj: any, index: number) => RenderTabs(obj, index))}
      </div>
    </div>
  );
}

export default NavBar;
