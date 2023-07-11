import { useNavigate } from "react-router-dom";
import "./NotFoundPage.scss";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-not-found-container">
      <div className="page-not-found-message-container">
        <h3>Page does not exist.</h3>
        <span className="page-not-found-header">
          Did you enter the wrong url?{" "}
          <span className="page-not-found-link" onClick={() => navigate(-1)}>Click here</span> to go back to
          where you were.
        </span>
      </div>
    </div>
  );
}

export default NotFoundPage;
