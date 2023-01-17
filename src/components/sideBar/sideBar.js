import "./SideBar.css";
import { FiPlusSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toggleCreateBookModal } from "../../store/slices/states.slice";
import { getBooks } from "../../store/slices/books.slice";
import React, { useEffect } from "react";

function SideBar() {
  const dispatch = useDispatch();
  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }
  const { listOfBooks } = useSelector((state) => {
    return state.books;
  });

  useEffect(() => {
    dispatch(getBooks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function RenderBookTab(book, index) {
    console.log(book.properties);
    return (
      <React.Fragment key={index}>
        <div className="tab">
          {book.properties["Book name"].rich_text[0].plain_text}
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="sidebar-container">
      <div className="add-book-btn" onClick={handleCreateBook}>
        <FiPlusSquare />
      </div>
      <div className="book-tab">
        {Array.isArray(listOfBooks.results) && listOfBooks.results.length > 0
          ? listOfBooks.results.map((book, index) => {
              return RenderBookTab(book, index);
            })
          : null}
      </div>
    </div>
  );
}

export default SideBar;
