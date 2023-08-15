import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import "./GeneralErrorPage.scss";
import { useEffect } from "react";

export default function GeneralErrorPage() {
  let error: any = useRouteError();
  const navigate = useNavigate();

  // change page title accordingly
  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      document.title = error.statusText;
    } else {
      document.title = "Something went wrong";
    }
  }, []);

  return (
    <div className="page-not-found-container">
      <div className="page-not-found-message-container">
        <h3>Something went wrong.</h3>
        <span className="page-not-found-header">
          <span className="page-not-found-link" onClick={() => navigate("/")}>
            Click here
          </span>
          &nbsp;to go back to the homepage.
        </span>
        {isRouteErrorResponse(error) && error.error?.stack && (
          <textarea
            rows={10}
            cols={60}
            disabled={true}
            style={{ color: "red", marginTop: "1rem" }}
            value={error.error.stack}
          />
        )}
      </div>
    </div>
  );
}
