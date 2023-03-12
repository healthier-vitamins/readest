import { useDispatch, useSelector } from "react-redux";
import {
  toggleBookSelectionPopoverState,
  toggleCreateBookModal,
} from "../../store/slices/state.slice";
import { addBookSelection, getAllBook } from "../../store/slices/book.slice";
import React, { useEffect } from "react";
import { bookSchema } from "../../utils/bookUtil.ts";
import { protectedFunction } from "../../utils/userUtil.ts";
import { FiPlusSquare } from "react-icons/fi";
import { BiBookHeart } from "react-icons/bi";
import { MdOutlineDeleteSweep } from "react-icons/md";
import "./BookSelectionPopover.scss";

function BookSelectionPopover() {
  const dispatch = useDispatch();

  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }
  const { bookSelectionPopoverState } = useSelector((state) => state.state);
  const { bookRes } = useSelector((state) => state.book);

  function RenderBookTab(book, index) {
    return (
      <React.Fragment key={index}>
        <div
          className="tab"
          onClick={() => {
            dispatch(addBookSelection(book));
          }}
        >
          {book.properties[bookSchema.BOOK_NAME].rich_text[0].plain_text}
        </div>
      </React.Fragment>
    );
  }

  function buttonClickedStyleMapper() {
    if (bookSelectionPopoverState) {
      return {
        color: "#B3A895",
      };
    }
    return {};
  }

  useEffect(() => {
    dispatch(getAllBook());
    // eslint-disable-next-line
  }, []);

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
          <div
            className="book-selection-buttons"
            onClick={() => {
              protectedFunction(handleCreateBook);
            }}
          >
            <FiPlusSquare className="add-book-icon" />
            <MdOutlineDeleteSweep className="_add-book-icon" />
          </div>
          <div className="book-tab-box">
            {Array.isArray(bookRes.results) && bookRes.results.length > 0
              ? bookRes.results.map((book, index) => {
                  return RenderBookTab(book, index);
                })
              : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSelectionPopover;
