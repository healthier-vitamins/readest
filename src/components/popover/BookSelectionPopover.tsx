import {
  toggleBookSelectionPopoverState,
  toggleCreateBookModal,
} from "../../store/slices/state.slice";
import { BookRes, addBookSelection } from "../../store/slices/book.slice";
import React, { useEffect } from "react";
import protectedFunction from "../../utils/protectedFunc";
import { FiPlusSquare } from "react-icons/fi";
import { BiBookHeart } from "react-icons/bi";
import { MdOutlineDeleteSweep } from "react-icons/md";
import "./BookSelectionPopover.scss";
import { Spinner } from "react-bootstrap";
import {
  setShowPopoverPage,
  toggleShowPopoverState,
} from "../../store/slices/state.slice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllBook } from "../../store/apis/book.api";

function BookSelectionPopover() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }
  const { bookSelectionPopoverState } = useAppSelector((state) => state.state);
  const { bookRes, getAllBookIsLoading } = useAppSelector(
    (state) => state.book
  );
  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state) => state.user);

  function RenderBookTab({ book, index }: { book: BookRes; index: number }) {
    return (
      <React.Fragment key={index}>
        <div
          className="tab"
          onClick={() => {
            dispatch(addBookSelection(book));
            console.log("book |||||| ", book);
            // navigate(`/b/${book.bookName}--${book.id}`);
            navigate(`/b/${book.bookName}`);
          }}
        >
          {/* {book.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text} */}
          {book.bookName}
        </div>
      </React.Fragment>
    );
  }

  function buttonClickedStyleMapper() {
    if (bookSelectionPopoverState) {
      return {
        color: "rgb(179, 168, 149)",
      };
    }
    return {};
  }

  useEffect(() => {
    if (isUserLoggedIn) dispatch(getAllBook());
  }, [dispatch, isUserLoggedIn]);

  return (
    <div className="book-tab-popover-wrapper">
      <div
        className="show-book-tab-button"
        onClick={() => dispatch(toggleBookSelectionPopoverState())}
      >
        <BiBookHeart
          className="book-icon"
          style={buttonClickedStyleMapper()}
        ></BiBookHeart>
      </div>

      {bookSelectionPopoverState && (
        <div className="book-tab-popover-container">
          {getAllBookIsLoading ? (
            <Spinner id="book-selection-spinner"></Spinner>
          ) : (
            <React.Fragment>
              {isUserLoggedIn && (
                <div className="book-selection-buttons">
                  {Array.isArray(bookRes) && bookRes.length == 0 && (
                    <div className="book-selection-popover-empty-books">
                      No books saved.
                    </div>
                  )}
                  <FiPlusSquare
                    className="add-book-icon"
                    onClick={() => {
                      protectedFunction(handleCreateBook);
                    }}
                  />
                  <MdOutlineDeleteSweep className="_add-book-icon" />
                </div>
              )}
              {/* books present */}
              {isUserLoggedIn &&
                Array.isArray(bookRes) &&
                bookRes.length > 0 && (
                  <div className="book-tab-box">
                    {bookRes.map((book: BookRes, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <RenderBookTab book={book} index={index} />
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              {/* user not logged in */}
              {!isUserLoggedIn && (
                <div
                  className="__popover-state-link"
                  onClick={() => {
                    dispatch(setShowPopoverPage("loginState"));
                    dispatch(toggleShowPopoverState());
                  }}
                >
                  Please login to save books.
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

export default BookSelectionPopover;
