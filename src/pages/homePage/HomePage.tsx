import YearTimer from "components/yearTimer/YearTimer";
import "./HomePage.scss";
import { useEffect } from "react";
import { useAppDispatch } from "store/hooks";
import { changeActiveTab } from "store/slices/book.slice";
import { isTokenExpired } from "utils/cryptography";
import Cookies from "universal-cookie";
import { setIsLoggedIn } from "store/slices/user.slice";
import { logout } from "utils/apis/userApis";
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();

function HomePage() {
  // const { selectedTab } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    // if (!isUserLoggedIn) {
    //   console.log("HERE ????????? ", isUserLoggedIn);

    //   // navigate("/");
    //   // dispatch(addToastNotificationArr("Please login"));
    // }
    const token = cookies.get("token");
    if (token) {
      if (isTokenExpired(token)) {
        logout(navigate);
      } else {
        dispatch(setIsLoggedIn());
      }
    }
  }, [dispatch, navigate]);

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
