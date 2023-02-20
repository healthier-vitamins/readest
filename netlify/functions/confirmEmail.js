import GoTrue from "gotrue-js";
import { HttpStatusCode } from "axios";
import { to } from "../../src/utils/promiseUtil";

exports.handler = async function (event, context) {
  const { token } = JSON.parse(event.body);
  const auth = new GoTrue({
    APIUrl: "https://readest.netlify.app/.netlify/identity",
    audience: "",
    setCookie: "true",
  });

  const [err, data] = await to(auth.confirm(token, true));
  if (!!err) {
    return {
      statusCode: err.status,
      body: err.message,
    };
  }

  return {
    statusCode: HttpStatusCode.Ok,
    body: JSON.stringify(data),
  };
};
