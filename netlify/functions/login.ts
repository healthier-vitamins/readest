import { HttpStatusCode } from "axios";
import { to } from "../../src/utils/promise";
import GoTrue from "gotrue-js";

const { NETLIFY_IDENTITY_URL } = process.env;

const auth = new GoTrue({
  APIUrl: NETLIFY_IDENTITY_URL,
  audience: "",
  setCookie: true,
});

exports.handler = async function (event: any, _context: any) {
  const { email, password } = JSON.parse(event.body);

  const [err, res] = await to(auth.login(email, password, true));
  if (err) {
    console.log(err);
    return {
      statusCode: err.status,
      body: err.json?.msg ? err.json.msg : err.json.error_description,
    };
  }
  return { statusCode: HttpStatusCode.Ok, body: JSON.stringify(res) };
};
