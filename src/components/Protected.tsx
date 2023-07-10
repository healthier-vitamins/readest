import Cookies from "universal-cookie";
import { useAppDispatch } from "../store/hooks";
import { isTokenExpired } from "../utils/cryptography";
import { setRedirector } from "../store/slices/state.slice";
const cookies = new Cookies();

function Protected({ children }: any) {
  const dispatch = useAppDispatch();

  let isUserLoggedIn = cookies.get("token");

  if (isTokenExpired(isUserLoggedIn)) {
    dispatch(setRedirector(true));
  } else {
    return children;
  }
}

export default Protected;
