import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useEffect } from "react";

function Protected({ children }: any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

  useEffect(() => {
    if (!isUserLoggedIn) {
      console.log("HERE ????????? ", isUserLoggedIn);

      navigate("/");
      // dispatch(addToastNotificationArr("Please login"));
    }
  }, [dispatch, navigate, isUserLoggedIn]);

  // return <Outlet />;
  return children;
}

export default Protected;
