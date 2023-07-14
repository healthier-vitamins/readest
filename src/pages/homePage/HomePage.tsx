import "./HomePage.scss";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useAppDispatch } from "../../store/hooks";
import { changeActiveTab } from "../../store/slices/book.slice";
import { isTokenExpired } from "../../utils/cryptography";
import { setIsLoggedIn } from "../../store/slices/user.slice";
import YearTimer from "../../components/yearTimer/YearTimer";
import { logout } from "../../store/apis/user.api";
const cookies = new Cookies();

function HomePage() {
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
      // dispatch(resetBookSelection());
    }
  }, [dispatch]);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        dispatch(setIsLoggedIn());
      }
    }
  }, []);

  return (
    <div className="homepage-container">
      {/* <div className="definition-container"> */}
      <div className="homepage-timer">
        <YearTimer></YearTimer>
      </div>
      {/* </div> */}
    </div>
  );
}

export default HomePage;
