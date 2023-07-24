import "./SideNavBar.scss";
import { FiPlusSquare } from "react-icons/fi";

import { toggleCreateBookModal } from "../../store/slices/state.slice";
import { addBookSelection } from "../../store/slices/book.slice";
import React, { useEffect } from "react";
import { bookSchema } from "../../utils/schemas/bookSchema";
import protectedFunction from "../../utils/protectedFunc";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

/**
 * @deprecated
 */
function SideNavBar() {
  const dispatch = useAppDispatch();
  function handleCreateBook() {
    dispatch(toggleCreateBookModal());
  }
  const { bookRes } = useAppSelector((state) => {
    return state.book;
  });

  // useEffect(() => {
  //   dispatch(getAllBook());
  // }, []);

  function RenderBookTab(book: any, index: number) {
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
    <>
      <div
        className="add-book-btn"
        onClick={() => {
          protectedFunction(handleCreateBook);
        }}
      >
        <FiPlusSquare />
      </div>

      <div className="book-tab-box">
        {Array.isArray(bookRes) && bookRes.length > 0
          ? bookRes.map((book: any, index: number) => {
              return RenderBookTab(book, index);
            })
          : null}
      </div>
    </>
  );
}

export default SideNavBar;
