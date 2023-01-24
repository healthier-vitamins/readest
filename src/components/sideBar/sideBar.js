import "./SideBar.css";
import { FiPlusSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toggleCreateBookModal } from "../../store/slices/state.slice";
import { addBookSelection, getAllBook } from "../../store/slices/book.slice";
import React, { useEffect } from "react";
import bookSchema from "../../utils/bookUtil.ts";

function SideBar() {
  const dispatch = useDispatch();
  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }
  const { bookRes } = useSelector((state) => {
    return state.book;
  });

  useEffect(() => {
    dispatch(getAllBook());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function RenderBookTab(book, index) {
    // console.log(book.properties);
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

  return (
    <div className="sidebar-container">
      <div className="add-book-btn" onClick={handleCreateBook}>
        <FiPlusSquare />
      </div>
      <div className="book-tab-box">
        {Array.isArray(bookRes.results) && bookRes.results.length > 0
          ? bookRes.results.map((book, index) => {
              return RenderBookTab(book, index);
            })
          : null}
      </div>
    </div>
  );
}

export default SideBar;
