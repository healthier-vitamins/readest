/* eslint-disable eqeqeq */
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { HiOutlineUserCircle } from "react-icons/hi";
import SignUpPopover from "../popover/SignUpPopover";
import React, { useEffect } from "react";
import { changeActiveTab } from "../../store/slices/book.slice";
import BookSelectionPopover from "../popover/BookSelectionPopover";
import OnClickOutsideComponent from "../OnClickOutsideComponent";
import {
  addToastNotificationArr,
  setBookSelectionPopoverState,
  setRedirector,
  setShowPopoverPage,
  setShowPopoverState,
} from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { logout } from "utils/apis/userApis";
import { GLOBALVARS } from "utils/GLOBALVARS";

function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { bookSelection } = useAppSelector((state) => state.book);
  const { bookSelectionPopoverState } = useAppSelector(
    (state: any) => state.state
  );

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state) => state.user);
  const { redirector } = useAppSelector((state: any) => state.state);

  // redirect from Protected component.
  useEffect(() => {
    if (redirector) {
      navigate("/");
      dispatch(addToastNotificationArr("Please login."));
      dispatch(setShowPopoverPage(GLOBALVARS.POPOVER_LOGIN));
      dispatch(setShowPopoverState(true));
      dispatch(setRedirector(false));
    }
  }, [redirector, dispatch, navigate]);

  function clickOutsideHelper() {
    dispatch(setBookSelectionPopoverState(false));
  }

  function onClickOutsideFunc() {
    clickOutsideHelper();
  }

  // helper for selected active tabs.
  function activeTabsClass(active: any) {
    if (active) {
      return "selected-active-tab";
    }
  }

  function RenderTabs(obj: any, index: number) {
    // const urlParams = window.location.href.substring(
    //   window.location.origin.length
    // );
    // console.log("??? ", urlParams);
    // let bookExists: boolean;
    // if (urlParams.startsWith("/b/")) {
    //   const [bookName] = params!.bookName!.split("--");
    //   bookExists = bookRes.some(
    //     (book) => book.bookName.toLowerCase() === bookName.toLowerCase()
    //   );
    // }
    if (obj.bookObj.bookName === "Definition") {
      return (
        <React.Fragment key={index}>
          <div
            className="singular-tab"
            onClick={() => {
              dispatch(changeActiveTab(index));
              if (obj.bookObj.id == 0) {
                navigate("/");
              } else {
                navigate(`/b/${obj.bookObj.bookName}--${obj.bookObj.id}`);
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
            if (obj.bookObj.id == 0) {
              navigate("/");
            } else {
              navigate(`/b/${obj.bookObj.bookName}--${obj.bookObj.id}`);
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
            <div
              className={GLOBALVARS.DEFAULT_LINK_CLASS}
              onClick={() => logout(navigate)}
            >
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
