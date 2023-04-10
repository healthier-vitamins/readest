import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.scss";
import React, { useEffect } from "react";
import WordPage from "../wordPage/WordPage";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useNavigate } from "react-router-dom";
import { changeActiveTab } from "store/slices/book.slice";

function HomePage() {
  const { bookSelection, selectedTab } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (window.location.pathname === "/") {
      dispatch(changeActiveTab(0));
    }
  }, [dispatch]);

  return (
    <div className="main-container">
      <div className="definition-container">
        {selectedTab.bookObj.bookName === "Definition" && (
          <WordDefinition></WordDefinition>
        )}
      </div>
    </div>
  );
}

export default HomePage;
