import GoTrue from "gotrue-js";
import { HttpStatusCode } from "axios";
import { to } from "../../src/utils/promise";

const { NETLIFY_IDENTITY_URL } = process.env;

exports.handler = async function (event: any, _context: any) {
  const { token } = JSON.parse(event.body);
  const auth = new GoTrue({
    APIUrl: NETLIFY_IDENTITY_URL,
    audience: "",
    setCookie: true,
  });

  const [err, data] = await to(auth.confirm(token, true));
  if (err) {
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
