import YearTimer from "components/yearTimer/YearTimer";
import WordDefinition from "../../components/wordDefinition/WordDefinition";
import "./HomePage.scss";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { changeActiveTab } from "store/slices/book.slice";

function HomePage() {
  // const { selectedTab } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();

  // function checkSelectedPageLogic() {
  //   for (let i = 0; i < bookSelection.length; i++) {
  //     if (
  //       JSON.stringify(bookSelection[i].bookObj) ===
  //       JSON.stringify(selectedTab.bookObj)
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  useEffect(() => {
    if (window.location.pathname === "/") {
      dispatch(changeActiveTab(0));
    }
  }, [dispatch]);

  return (
    <div className="main-container">
      <div className="definition-container">
        <YearTimer></YearTimer>
        <WordDefinition></WordDefinition>
      </div>
    </div>
  );
}

export default HomePage;
