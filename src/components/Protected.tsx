import Cookies from "universal-cookie";
import { useAppDispatch } from "../store/hooks";
import { getEmailFromToken, isTokenExpired } from "../utils/cryptography";
import { setUnauthorisedRedirector } from "../store/slices/state.slice";
import { ReactNode, useEffect, useState } from "react";
import { userLoggedIn } from "../store/slices/user.slice";

const cookies = new Cookies();

function Protected({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [token, _setToken] = useState(cookies.get("token"));

  useEffect(() => {
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) {
        const email = getEmailFromToken(token);
        if (email) {
          dispatch(userLoggedIn(email));
        }
      } else {
        dispatch(setUnauthorisedRedirector(true));
      }
    }
  }, [token]);

  if ((token && isTokenExpired(token)) || !token) {
    dispatch(setUnauthorisedRedirector(true));
  } else {
    return children;
  }
  // if ((token && !isTokenExpired(token)) || token) {
  //   return children;
  // } else {
  //   return null;
  // }
  // return token ? <>{children}</> : null;
}

export default Protected;
