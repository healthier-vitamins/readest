import { HttpStatusCode } from "axios";
import jwt_decode from "jwt-decode";


exports.handler = async function (event, context) {
  console.log(event);
  const { token } = JSON.parse(event.body);

  const decoded = jwt_decode(token);
  if (!decoded) {
    return {
      statusCode: HttpStatusCode.NotFound,
      body: "Invalid token. Please login again.",
    };
  }
  return {
    statusCode: HttpStatusCode.Ok,
    body: JSON.stringify(decoded),
  };
};
