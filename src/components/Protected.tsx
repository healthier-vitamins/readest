import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { isTokenExpired } from "utils/cryptography";
import { setIsLoggedIn, setIsLoggedOut } from "store/slices/user.slice";
const cookies = new Cookies();

function Protected({ children }: any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);
  // const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  useEffect(() => {
    // if (!isUserLoggedIn) {
    //   console.log("HERE ????????? ", isUserLoggedIn);

    //   // navigate("/");
    //   // dispatch(addToastNotificationArr("Please login"));
    // }
    // const token = cookies.get("token");
    // if (isTokenExpired(token)) {
    //   dispatch(setIsLoggedOut());
    // } else {
    //   dispatch(setIsLoggedIn());
    // }

    console.log("HERE ????????? ", isUserLoggedIn);
  }, [dispatch, isUserLoggedIn]);

  // return <Outlet />;
  // return children;
  return isUserLoggedIn ? children : <Navigate to={"/"}></Navigate>;
}

export default Protected;
