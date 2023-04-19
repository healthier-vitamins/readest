import { useAppDispatch } from "store/hooks";
import Cookies from "universal-cookie";
import { setRedirector } from "store/slices/state.slice";
const cookies = new Cookies();

function Protected({ children }: any) {
  const dispatch = useAppDispatch();

  const isUserLoggedIn = cookies.get("token");
  console.log("HERE ????????? ", isUserLoggedIn);

  if (!isUserLoggedIn) {
    dispatch(setRedirector(true));
  } else {
    return children;
  }
}

export default Protected;
